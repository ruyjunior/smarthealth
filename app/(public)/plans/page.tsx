'use client';
import { useState } from "react";
import { handleCheckout } from '@/app/lib/stripe/checkout';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const idPlanMonth = "price_1R3eqQBTcFRiXn7vvWKKEo4M";
const idPlanYear = "price_1RTDTBBTcFRiXn7vmd7XzYev";

const benefits = [
  "Agenda online e gestão de pacientes",
  "Receita digital e prontuário eletrônico",
  "Gráficos de evolução e relatórios",
  "Suporte especializado",
  "Acesso seguro e em nuvem",
];

export default function PlansPage() {
  const [isLoading, setIsLoading] = useState<"year" | "month" | null>(null);

  const onCheckout = async (plan: "year" | "month", id: string) => {
    setIsLoading(plan);
    try {
      await handleCheckout(id);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen pt-30 bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center py-12 px-4 sm:px-8">
      <h1 className="text-4xl font-extrabold text-blue-800 mb-2 text-center">Escolha o plano ideal para sua clínica</h1>
      <p className="text-lg text-gray-600 mb-10 text-center max-w-2xl">
        Tenha acesso a todas as ferramentas do Smart Health e proporcione o melhor atendimento para seus pacientes.
      </p>
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl justify-center items-stretch">
        {/* Plano Anual */}
        <div className="flex-1 bg-white rounded-2xl shadow-xl border-2 border-blue-600 flex flex-col items-center p-8 relative">
          <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-1 rounded-full text-sm font-bold shadow-md">MAIS VANTAJOSO</span>
          <h2 className="text-2xl font-bold text-blue-700 mb-2">Plano Anual</h2>
          <div className="text-4xl font-extrabold text-blue-800 mb-2">R$ 990<span className="text-lg font-normal text-gray-500">/ano</span></div>
          <div className="text-sm text-gray-500 mb-6">Equivalente a R$ 82,50/mês</div>
          <ul className="mb-8 text-left space-y-2">
            {benefits.map((b, i) => (
              <li key={i} className="flex items-center gap-2 text-gray-700">
                <CheckCircleIcon className="h-5 w-5 text-blue-500" />
                {b}
              </li>
            ))}
          </ul>
          <button
            onClick={() => onCheckout("year", idPlanYear)}
            disabled={isLoading !== null}
            className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-lg font-bold transition-all
              ${isLoading === "year"
                ? "bg-blue-400 text-white cursor-wait"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg active:scale-95"}
              disabled:opacity-60`}
          >
            {isLoading === "year" ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Redirecionando...
              </>
            ) : (
              <>Assinar Plano Anual</>
            )}
          </button>
          <div className="text-xs text-gray-400 mt-4">Economize 30% no anual</div>
        </div>

        {/* Plano Mensal */}
        <div className="flex-1 bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col items-center p-8">
          <h2 className="text-2xl font-bold text-green-700 mb-2">Plano Mensal</h2>
          <div className="text-4xl font-extrabold text-green-800 mb-2">R$ 119<span className="text-lg font-normal text-gray-500">/mês</span></div>
          <div className="text-sm text-gray-500 mb-6">Sem fidelidade</div>
          <ul className="mb-8 text-left space-y-2">
            {benefits.map((b, i) => (
              <li key={i} className="flex items-center gap-2 text-gray-700">
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                {b}
              </li>
            ))}
          </ul>
          <button
            onClick={() => onCheckout("month", idPlanMonth)}
            disabled={isLoading !== null}
            className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-lg font-bold transition-all
              ${isLoading === "month"
                ? "bg-green-400 text-white cursor-wait"
                : "bg-green-600 hover:bg-green-700 text-white shadow-lg active:scale-95"}
              disabled:opacity-60`}
          >
            {isLoading === "month" ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Redirecionando...
              </>
            ) : (
              <>Assinar Plano Mensal</>
            )}
          </button>
          <div className="text-xs text-gray-400 mt-4">Cancele quando quiser</div>
        </div>
      </div>
      <div className="mt-12 text-center text-gray-500 text-sm">
        Todos os planos incluem suporte, atualizações e acesso ilimitado à plataforma.
      </div>
    </div>
  );
}