'use client';

import { signOut } from 'next-auth/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

/**
 * Shown when a signed-in account is not linked to a clinic yet (for example a
 * checkout that never finished). Those users would otherwise crash on every
 * private page, because every query needs a clinic to scope to.
 */
export default function SemClinicaPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-16">
      <div className="rounded-[2rem] border border-amber-200 bg-amber-50 p-8 shadow-sm">
        <div className="flex items-start gap-4">
          <ExclamationTriangleIcon className="h-8 w-8 shrink-0 text-amber-600" />
          <div className="space-y-3">
            <h1 className="text-2xl font-extrabold text-slate-800">
              Sua conta ainda não está vinculada a uma clínica
            </h1>
            <p className="text-sm leading-relaxed text-slate-600">
              Para acessar o painel, sua conta precisa estar associada a uma clínica. Isso costuma
              acontecer quando a contratação não chegou ao fim ou quando o vínculo foi alterado.
            </p>
            <p className="text-sm leading-relaxed text-slate-600">
              Se você já contratou um plano, fale com o suporte informando o e-mail desta conta. Se
              você é funcionário, peça ao gerente da sua clínica para revisar o seu cadastro.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: '/' })}
          className="inline-flex items-center justify-center rounded-xl bg-blue-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-900"
        >
          Sair e entrar com outra conta
        </button>
        <a
          href="mailto:contato@smarthealth.app.br"
          className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Falar com o suporte
        </a>
      </div>
    </div>
  );
}
