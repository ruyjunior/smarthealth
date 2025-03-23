import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  try {
    const { priceId } = req.body; // O ID do preço do plano no Stripe

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "pix"], // Cartão e PIX
      mode: "subscription", // Para planos recorrentes
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/sucesso`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancelado`,
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
