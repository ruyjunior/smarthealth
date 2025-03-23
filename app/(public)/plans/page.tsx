'use client';
import Image from "next/image";
import  { handleCheckout }  from '@/utils/stripe/checkout';

const idPlanYear = "price_1R3eqQBTcFRiXn7vvWKKEo4M";
const idPlanMonth = "price_1R3eqQBTcFRiXn7vAoRz3RmC";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1>Plans</h1>
        
        <button onClick={() => handleCheckout(idPlanYear)}>
            Assinar Plano Anual
        </button>

        <button onClick={() => handleCheckout(idPlanMonth)}>
            Assinar Plano Mensal
        </button>

      </main>
    </div>
  );
}
