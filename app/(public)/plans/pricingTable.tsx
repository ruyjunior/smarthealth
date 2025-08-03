"use client";

import { useEffect, useRef } from "react";

export default function PricingTable() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const pricing = document.createElement("stripe-pricing-table");
    pricing.setAttribute("pricing-table-id", "prctbl_1RrQ4yBTcFRiXn7vH085pict");
    pricing.setAttribute("publishable-key", "pk_live_51R3cMHBTcFRiXn7vAJqloLrBccGgxscB2q3LNIoK0i2FwB2CQLO1bqfIS5ztnXQlS1RLb8tiS2mXVU8UEprdrVsZ00pzAprfEJ");
    pricing.setAttribute("client-reference-id", "user123"); // opcional
    pricing.setAttribute("style", "width: 100%; height: auto;");

    ref.current.appendChild(pricing);
  }, []);

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg shadow-md p-4 mt-4 md:pt-0">
      <div ref={ref} />
    </div>
  );
}
