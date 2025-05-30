import { NextRequest } from "next/server";
import Stripe from "stripe";
import { sql } from '@vercel/postgres'; // Conexão com Vercel Postgres

export const config = { api: { bodyParser: false } };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(req: NextRequest) {
  console.log("🔹 Webhook recebido!");
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    console.error("❌ Nenhuma assinatura Stripe recebida!");
    return new Response(JSON.stringify({ error: "Sem assinatura Stripe" }), { status: 400 });
  }

  const payload = await req.text();
  console.log("📩 Payload recebido:", payload);
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("❌ Erro ao validar webhook:", err);
    return new Response(JSON.stringify({ error: "Erro na validação do webhook" }), { status: 400 });
  }

  console.log("🎉 Evento Stripe recebido:", event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const customerEmail = session.customer_details?.email;
    const paymentIntentId = typeof session.payment_intent === 'string' ? session.payment_intent : null;
    const amountPaid = session.amount_total;
    const status = session.payment_status;

    // Lê metadados e custom_fields
    const metadata = session.metadata;

    const nomeClinica = session.custom_fields?.find(
      (field: any) => field.key === "nomefantasiadaclnica"
    )?.text?.value ?? "Clínica Sem Nome";

    let expiresAt = new Date();
    
    if (metadata?.plan_type === 'mensal') {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    } else if (metadata?.plan_type === 'anual') {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    } else if (metadata?.plan_type === 'trial') {
      expiresAt.setDate(expiresAt.getDate() + 7);
    }

    if (!customerEmail) {
      return new Response("Customer email missing", { status: 400 });
    }

    try {
      // Insere ou atualiza usuário
      const userResult = await sql`
        INSERT INTO smarthealth.users (email, name, status, payment_intent, amount_paid, plan_expires_at)
        VALUES (
          ${customerEmail}, 
          ${session.customer_details?.name}, 
          'paid', 
          ${paymentIntentId}, 
          ${amountPaid},
          ${expiresAt.toISOString()}
        )
        ON CONFLICT(email) DO UPDATE 
        SET
          status = 'paid',
          payment_intent = ${paymentIntentId},
          amount_paid = ${amountPaid},
          plan_expires_at = ${expiresAt.toISOString()}
        RETURNING id, email, status;
      `;

      if (userResult.rowCount === 0) {
        return new Response("User not found", { status: 404 });
      }

      const userId = userResult.rows[0].id;

      // Cria a clínica se não existir
      const clinicCheck = await sql`
        SELECT id FROM smarthealth.clinics WHERE idmanager = ${userId}
      `;

      if (clinicCheck.rowCount === 0) {
        await sql`
          INSERT INTO smarthealth.clinics (title, idmanager)
          VALUES (${nomeClinica}, ${userId})
        `;
        console.log(`✅ Clínica criada para ${nomeClinica}`);
      } else {
        console.log(`🔎 Clínica já existe para o usuário ${customerEmail}`);
      }

      console.log(`💰 Pagamento confirmado para ${customerEmail}`);
    } catch (err) {
      console.error("❌ Erro ao atualizar usuário:", err);
      return new Response("Database error", { status: 500 });
    }
  }

  if (event.type === "invoice.payment_succeeded") {
    console.log("✅ Pagamento de assinatura confirmado!");
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}
