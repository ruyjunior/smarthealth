import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export async function handleCheckout(priceId: string) {
  
  const stripe = await stripePromise;

  const response = await fetch("/api/stripe/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ priceId }),
  });

  const { sessionId } = await response.json();
  await stripe!.redirectToCheckout({ sessionId });
}