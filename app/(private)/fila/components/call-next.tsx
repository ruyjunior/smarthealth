'use client';

import { useActionState, useTransition } from 'react';
import { SpeakerWaveIcon } from '@heroicons/react/24/outline';
import { callNextTicket, type State } from '@/app/domains/queues/actions';

/**
 * Chama a próxima senha da fila (a ação respeita preferencial e ordem de chegada).
 * A sala é opcional: quem chama pode escolher para onde o paciente vai.
 */
export default function CallNext({ offices }: { offices: { id: string; title: string }[] }) {
  const [state, formAction] = useActionState<State, FormData>(callNextTicket, {});
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(() => formAction(new FormData(event.currentTarget)));
  };

  return (
    <div className="rounded-[1.5rem] border border-blue-100 bg-white p-5 shadow-[0_18px_50px_rgba(148,163,184,0.12)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <form onSubmit={handleSubmit} className="w-full sm:max-w-md">
          <label htmlFor="idoffice" className="mb-2 block text-sm font-medium text-slate-700">
            Sala / consultório (opcional)
          </label>
          <select
            id="idoffice"
            name="idoffice"
            defaultValue=""
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          >
            <option value="">Chamar sem informar a sala</option>
            {offices.map((office) => (
              <option key={office.id} value={office.id}>
                {office.title}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={isPending}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4 text-base font-bold text-white shadow-lg shadow-blue-500/25 transition hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50"
          >
            <SpeakerWaveIcon className="h-5 w-5" />
            {isPending ? 'Chamando...' : 'Chamar próximo'}
          </button>

          {state.message && (
            <p aria-live="polite" className="mt-3 text-sm font-semibold text-amber-700">
              {state.message}
            </p>
          )}
        </form>

        <p className="text-sm leading-relaxed text-slate-500 sm:max-w-xs">
          A chamada respeita a ordem: primeiro quem tem <strong>preferência legal</strong>, depois a
          ordem de chegada.
        </p>
      </div>
    </div>
  );
}
