import { NextRequest } from 'next/server';
import Stripe from 'stripe';
import { sql } from '@vercel/postgres';
import { MANAGER_ROLE } from '@/app/lib/roles';
import { addInterval } from '@/app/lib/billing';

// Initialize Stripe with the correct API version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

// Helper function to read raw body
async function getRawBody(readable: ReadableStream<Uint8Array>): Promise<Buffer> {
  const chunks = [];
  const reader = readable.getReader();

  let result;
  while (!(result = await reader.read()).done) {
    chunks.push(result.value);
  }

  return Buffer.concat(chunks);
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return new Response('No signature header', { status: 400 });
  }

  let event: Stripe.Event;
  let rawBody: Buffer;

  try {
    // Get raw body before any parsing
    rawBody = await getRawBody(req.body!);

    // Verify signature with raw body
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('❌ Webhook error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    return new Response(`Webhook Error: ${errorMessage}`, { status: 400 });
  }

  // Evento já processado: o Stripe garante entrega "ao menos uma vez", então
  // reentrega é rotina e não pode repetir efeito nenhum.
  const processed = await sql`
    SELECT 1 FROM smarthealth.stripe_events WHERE event_id = ${event.id} LIMIT 1
  `;

  if (processed.rows.length > 0) {
    console.log(`↩️ Evento ${event.id} já processado, ignorado`);
    return new Response(JSON.stringify({ received: true, duplicate: true }), { status: 200 });
  }

  // Handle specific event types
  switch (event.type) {
    case 'checkout.session.completed':
      try {
        const session = event.data.object as Stripe.Checkout.Session;

        // Validate required fields
        if (!session.customer_details?.email) {
          throw new Error('Customer email is required');
        }

        const customerEmail = session.customer_details.email;

        /*
         * O plano vem do preço comprado, nunca do `session.metadata`: a pricing
         * table do Stripe entrega esse metadata vazio, e ler de lá gravava
         * `type = NULL` com vencimento igual a agora — plano pago sem validade.
         */
        const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ['line_items'],
        });
        const price = fullSession.line_items?.data?.[0]?.price ?? null;
        const planType = price?.metadata?.plan_type ?? null;

        const subscriptionId =
          typeof fullSession.subscription === 'string'
            ? fullSession.subscription
            : fullSession.subscription?.id;

        const subscription = subscriptionId
          ? await stripe.subscriptions.retrieve(subscriptionId)
          : null;

        /*
         * Trial chega como `payment_status: 'paid'` com total zero, então a
         * vigência vem do fim do trial; nas cobranças pagas vem do fim do
         * período da assinatura. São datas que o Stripe já calculou, então
         * reentregar o evento reafirma o mesmo vencimento em vez de dobrar.
         */
        let expiresAt: Date | null =
          subscription?.status === 'trialing' && subscription.trial_end
            ? new Date(subscription.trial_end * 1000)
            : null;

        if (!expiresAt && fullSession.payment_status === 'paid') {
          const periodEnd = subscription?.current_period_end;

          if (periodEnd) {
            expiresAt = new Date(periodEnd * 1000);
          } else if ((fullSession.amount_total ?? 0) > 0) {
            // sem assinatura para consultar, só um pagamento real autoriza um período
            expiresAt = addInterval(new Date(), price?.recurring?.interval);
          }
        }

        if (!expiresAt) {
          console.warn(`⚠️ Nada concedido para ${customerEmail}: pagamento sem período`);
          break;
        }

        // Process custom field
        const nomeClinica =
          session.custom_fields?.find((field) => field.key === 'nomefantasiadaclinica')?.text
            ?.value ?? 'Clínica Sem Nome';

        // Update database
        await sql`
        INSERT INTO smarthealth.users (email, name, role)
        VALUES ( ${customerEmail}, ${session.customer_details.name}, ${MANAGER_ROLE})
        ON CONFLICT (email) DO NOTHING
        `;

        const userResult = await sql`
          SELECT id, idclinic FROM smarthealth.users WHERE email = ${customerEmail}
        `;

        if (!userResult.rows || userResult.rows.length === 0) {
          console.error('❌ Nenhum usuário foi criado/atualizado');
          return new Response('User not found or not created', { status: 404 });
        }

        const { id: userId, idclinic: currentClinic } = userResult.rows[0];
        const amountDB = parseFloat(((fullSession.amount_total ?? 0) / 100).toFixed(2));

        /*
         * A clínica só é criada quando a conta ainda não tem uma, e o vínculo nunca
         * é reapontado: o e-mail do checkout é digitado pelo pagante e não é
         * verificado, então não pode mudar o tenant de quem já tem clínica.
         */
        let targetClinic: string | null = currentClinic ?? null;

        if (!targetClinic) {
          const ownedClinic = await sql`
            SELECT id FROM smarthealth.clinics WHERE idmanager = ${userId} LIMIT 1
          `;

          if (ownedClinic.rows.length > 0) {
            targetClinic = ownedClinic.rows[0].id;
            console.log(`🔎 Clínica já existe para o usuário ${customerEmail}`);
          } else {
            const insertedClinic = await sql`
              INSERT INTO smarthealth.clinics (title, idmanager)
              VALUES (${nomeClinica}, ${userId})
              RETURNING id
            `;
            targetClinic = insertedClinic.rows[0].id;
            console.log(`✅ Clínica criada para ${nomeClinica}`);
          }
        }

        /*
         * Uma linha de crédito por e-mail/clínica (garantida pela constraint
         * UNIQUE): a reentrega do mesmo evento reafirma o vencimento — GREATEST
         * e COALESCE nunca regridem — em vez de criar um crédito a mais.
         */
        await sql`
          INSERT INTO smarthealth.credits (email, amount, idclinic, expires, type)
          VALUES (
          ${customerEmail},
          ${amountDB},
          ${targetClinic},
          ${expiresAt.toISOString()},
          ${planType}
          )
          ON CONFLICT (email, idclinic) DO UPDATE
          SET expires = GREATEST(credits.expires, EXCLUDED.expires),
              type = COALESCE(EXCLUDED.type, credits.type),
              amount = EXCLUDED.amount
        `;
        console.log(`✅ Crédito de ${customerEmail} válido até ${expiresAt.toISOString()}`);

        if (currentClinic !== targetClinic) {
          await sql`
            UPDATE smarthealth.users
            SET idclinic = ${targetClinic}
            WHERE email = ${customerEmail} AND idclinic IS NULL
         `;
        }
      } catch (err) {
        console.error('Database error:', err);
        return new Response('Database error', { status: 500 });
      }
      break;

    case 'invoice.payment_succeeded':
      try {
        const invoice = event.data.object as Stripe.Invoice;
        const line = invoice.lines?.data?.[0] ?? null;
        const email = invoice.customer_email;
        const periodEnd = line?.period?.end ?? null;

        // Faturas de valor zero (trial) e sem período não estendem nada.
        if (!email || !periodEnd || (invoice.amount_paid ?? 0) <= 0) {
          break;
        }

        /*
         * O vencimento vem do período que a fatura cobre, e não de "agora + 1
         * período": assim a reentrega da mesma fatura não estende duas vezes.
         */
        const updated = await sql`
          UPDATE smarthealth.credits
          SET expires = GREATEST(expires, ${new Date(periodEnd * 1000).toISOString()}),
              type = COALESCE(${line?.price?.metadata?.plan_type ?? null}, type)
          WHERE email = ${email}
            AND idclinic = (SELECT idclinic FROM smarthealth.users WHERE email = ${email})
        `;

        console.log(`♻️ Renovação aplicada para ${email}: ${updated.rowCount} crédito(s)`);
      } catch (err) {
        console.error('Invoice error:', err);
        return new Response('Database error', { status: 500 });
      }
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  /*
   * O evento só é marcado depois de processar: assim a reentrega não repete
   * nada, mas uma tentativa que falhou (o 500 acima) continua liberada para o
   * retry do Stripe.
   */
  await sql`
    INSERT INTO smarthealth.stripe_events (event_id, type)
    VALUES (${event.id}, ${event.type})
    ON CONFLICT (event_id) DO NOTHING
  `;

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}
