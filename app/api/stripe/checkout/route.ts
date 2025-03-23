import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

export async function POST(req: NextRequest) {
  try {
    const { priceId } = await req.json(); // O ID do preço do plano no Stripe

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'pix'], // Cartão e PIX
      mode: 'subscription', // Para planos recorrentes
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/sucesso`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancelado`,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Método não permitido' }, { status: 405 });
}