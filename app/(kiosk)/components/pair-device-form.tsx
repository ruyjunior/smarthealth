'use client';

import { useActionState, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { pairDevice, type PairState } from '@/app/domains/devices/actions';
import Loading from '@/app/components/ui/loading';

export default function PairDeviceForm() {
  // Lido no cliente para que um `?codigo=` (link pronto para o técnico) não force
  // a página a depender de searchParams no servidor.
  const prefill = useSearchParams().get('codigo') ?? '';
  const [state, formAction] = useActionState<PairState, FormData>(pairDevice, {});
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(() => formAction(new FormData(event.currentTarget)));
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      {isPending ? (
        <Loading />
      ) : (
        <>
          <label htmlFor="code" className="mb-2 block text-sm font-medium">
            Código de pareamento
          </label>
          <input
            id="code"
            name="code"
            defaultValue={prefill}
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            maxLength={9}
            placeholder="K7M4-2QP9"
            className="w-full rounded-2xl border border-white/15 bg-slate-950/70 px-4 py-4 text-center font-mono text-3xl uppercase tracking-[0.3em] text-white outline-none placeholder:text-slate-600 focus:border-blue-400"
            aria-describedby="code-hint code-error"
          />
          <p id="code-hint" className="mt-2 text-center text-xs text-slate-400">
            8 caracteres, mostrados como K7M4-2QP9
          </p>

          <div id="code-error" aria-live="polite" aria-atomic="true">
            {state.message && (
              <p className="mt-3 text-sm font-semibold text-red-300">{state.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="mt-5 w-full rounded-2xl bg-blue-600 px-6 py-4 text-lg font-bold transition hover:bg-blue-500"
          >
            Parear dispositivo
          </button>
        </>
      )}
    </form>
  );
}
