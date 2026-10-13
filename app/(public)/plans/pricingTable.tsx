'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';

const PRICING_TABLE_ID = process.env.NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID;
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const isConfigured = Boolean(PRICING_TABLE_ID && PUBLISHABLE_KEY);

export default function PricingTable({
  clientReferenceId,
}: {
  /** Optional id forwarded to Stripe so a checkout can be traced back to a user. */
  clientReferenceId?: string;
} = {}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container || !PRICING_TABLE_ID || !PUBLISHABLE_KEY) return;

    // Idempotent: avoids stacking two tables if the effect runs twice.
    container.replaceChildren();

    const pricing = document.createElement('stripe-pricing-table');
    pricing.setAttribute('pricing-table-id', PRICING_TABLE_ID);
    pricing.setAttribute('publishable-key', PUBLISHABLE_KEY);
    if (clientReferenceId) {
      pricing.setAttribute('client-reference-id', clientReferenceId);
    }
    pricing.setAttribute('style', 'width: 100%; height: auto;');

    container.appendChild(pricing);
  }, [clientReferenceId]);

  if (!isConfigured) {
    if (process.env.NODE_ENV === 'production') return null;

    return (
      <div className="mt-4 w-full rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
        <p className="font-semibold">Tabela de preços não configurada.</p>
        <p className="mt-1">
          Defina <code>NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID</code> e{' '}
          <code>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> no ambiente.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg shadow-md p-4 mt-4 md:pt-0">
      {/* Loaded here instead of every page: this is the only consumer. */}
      <Script src="https://js.stripe.com/v3/pricing-table.js" strategy="afterInteractive" />
      <div ref={ref} />
    </div>
  );
}
