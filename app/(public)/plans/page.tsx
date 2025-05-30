'use client';
import { useState } from "react";
import { handleCheckout } from '@/app/lib/stripe/checkout';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import PricingPage from "./PricingPage";

const idPlanMonth = "price_1R3eqQBTcFRiXn7vvWKKEo4M";
const idPlanYear = "price_1RTDTBBTcFRiXn7vmd7XzYev";

const benefitsPlanMonth = [
  "Agenda online e gestão de pacientes",
  "Receita digital e prontuário eletrônico",
  "Gráficos de evolução e relatórios",
  "Suporte especializado",
  "Acesso seguro e em nuvem",
  "10 usuários inclusos",
];

const benefitsPlanYear = [
  "Agenda online e gestão de pacientes",
  "Receita digital e prontuário eletrônico",
  "Gráficos de evolução e relatórios",
  "Suporte especializado",
  "Acesso seguro e em nuvem",
  "Sem limite de usuários",
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

    <div className="min-h-screen pt-30 bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center py-12 px-4 sm:px-8 rounded-md">
      <PricingPage />
    </div>

  );
}