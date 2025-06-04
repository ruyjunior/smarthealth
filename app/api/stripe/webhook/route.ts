import { NextRequest } from "next/server";
import Stripe from "stripe";
import { sql } from "@vercel/postgres";

// Initialize Stripe with the correct API version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
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
  const signature = req.headers.get("stripe-signature");
  
  if (!signature) {
    return new Response("No signature header", { status: 400 });
  }

  let event: Stripe.Event;
  let rawBody: Buffer;

  try {
    // Get raw body before any parsing
    rawBody = await getRawBody(req.body!);
    
    // Verify signature with raw body
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("❌ Webhook error:", err);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle specific event types
  switch (event.type) {
    case "checkout.session.completed":
      try {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Validate required fields
        if (!session.customer_details?.email) {
          throw new Error("Customer email is required");
        }

        const customerEmail = session.customer_details.email;
        const paymentIntentId = typeof session.payment_intent === "string" 
          ? session.payment_intent 
          : null;
        
        // Process custom field
        const nomeClinica = session.custom_fields?.find(
          (field: any) => field.key === "nomefantasiadaclnica"
        )?.text?.value ?? "Clínica Sem Nome";

        // Calculate expiration date
        const expiresAt = new Date();
        const metadata = session.metadata || {};
        
        if (metadata.plan_type === "mensal") {
          expiresAt.setMonth(expiresAt.getMonth() + 1);
        } else if (metadata.plan_type === "anual") {
          expiresAt.setFullYear(expiresAt.getFullYear() + 1);
        } else if (metadata.plan_type === "trial") {
          expiresAt.setDate(expiresAt.getDate() + 7);
        }

        // Update database
        await sql`
          INSERT INTO smarthealth.users (email, name, status, payment_intent, amount_paid, plan_expires_at)
          VALUES (
            ${customerEmail},
            ${session.customer_details.name},
            'paid',
            ${paymentIntentId},
            ${session.amount_total},
            ${expiresAt.toISOString()}
          )
          ON CONFLICT(email) DO UPDATE
          SET
            status = 'paid',
            payment_intent = ${paymentIntentId},
            amount_paid = ${session.amount_total},
            plan_expires_at = ${expiresAt.toISOString()}
        `;

        // Check and create clinic if needed
        const userResult = await sql`
          SELECT id FROM smarthealth.users WHERE email = ${customerEmail}
        `;
        
        if (userResult.rowCount > 0) {
          const clinicCheck = await sql`
            SELECT id FROM smarthealth.clinics WHERE idmanager = ${userResult.rows[0].id}
          `;
          
          if (clinicCheck.rowCount === 0) {
            await sql`
              INSERT INTO smarthealth.clinics (title, idmanager)
              VALUES (${nomeClinica}, ${userResult.rows[0].id})
            `;
          }
        }
      } catch (err) {
        console.error("Database error:", err);
        return new Response("Database error", { status: 500 });
      }
      break;
      
    case "invoice.payment_succeeded":
      // Handle subscription payments
      break;
      
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}