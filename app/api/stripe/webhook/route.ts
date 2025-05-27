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

    // Dados do pagamento
    const customerEmail = session.customer_details?.email;
    const paymentIntentId = typeof session.payment_intent === 'string' ? session.payment_intent : null;
    const amountPaid = session.amount_total;
    const status = session.payment_status; // Ex: "paid"

    if (!customerEmail) {
      return new Response("Customer email missing", { status: 400 });
    }

    try {
      // Verifica se o email do cliente existe no banco
      const result = await sql`
        INSERT INTO smarthealth.users (email, name, status, payment_intent, amount_paid)
        VALUES (
          ${customerEmail}, 
          ${session.customer_details?.name}, 
          'paid', 
          ${paymentIntentId}, 
          ${amountPaid}
        )
        ON CONFLICT(email) DO UPDATE 
        SET
          status = 'paid',
          payment_intent = ${paymentIntentId},
          amount_paid = ${amountPaid}
        RETURNING id, email, status;
      `;

      if (result.rowCount === 0) {
        return new Response("User not found", { status: 404 });
      }

      console.log(`Pagamento confirmado para ${customerEmail}`);
    } catch (err) {
      console.error("Erro ao atualizar usuário:", err);
      return new Response("Database error", { status: 500 });
    }

  }
  if (event.type === "invoice.payment_succeeded") {
    //console.log("✅ Pagamento confirmado!", event.data.object);
    console.log("✅ Pagamento de assinatura confirmado!");
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}
