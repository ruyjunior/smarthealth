'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

/**
 * Error boundary for the private area. Without it an unexpected failure (a
 * provider hiccup, a bad record) surfaces as a bare 500 page and the user loses
 * their navigation entirely.
 */
export default function PrivateError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl rounded-[2rem] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-8 shadow-[0_25px_80px_rgba(59,130,246,0.08)]">
        <div className="flex items-start gap-4">
          <ExclamationTriangleIcon className="h-8 w-8 shrink-0 text-amber-500" />
          <div className="space-y-3">
            <h1 className="text-2xl font-extrabold text-slate-800">Algo saiu do esperado</h1>
            <p className="text-sm leading-relaxed text-slate-600">
              Não conseguimos carregar esta tela. Você pode tentar novamente — se o problema
              continuar, avise o suporte e informe o código abaixo.
            </p>
            {error.digest && (
              <p className="font-mono text-xs text-slate-500">Código: {error.digest}</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center rounded-xl bg-blue-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-900"
          >
            Tentar novamente
          </button>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-white"
          >
            Voltar ao painel
          </Link>
        </div>
      </div>
    </main>
  );
}
