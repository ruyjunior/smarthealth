'use client';

import { useState, useTransition } from 'react';
import {
  cancelTicket,
  finishTicket,
  markTicketAbsent,
  recallTicket,
  startTicket,
} from '@/app/domains/queues/actions';
import type { QueueStatus } from '@/app/domains/queues/types';

type Action = {
  label: string;
  run: () => Promise<{ message?: string } | void>;
  className: string;
};

const TONES = {
  blue: 'border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-300 hover:bg-blue-100',
  emerald:
    'border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-100',
  amber: 'border-amber-200 bg-amber-50 text-amber-700 hover:border-amber-300 hover:bg-amber-100',
  slate: 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-slate-100',
} as const;

/**
 * As ações oferecidas são exatamente as que a máquina de estados do domínio aceita,
 * para a recepção não receber um erro de transição inválida ao clicar.
 */
function actionsFor(status: QueueStatus, id: string): Action[] {
  const bind = (run: (id: string) => Promise<{ message?: string } | void>) => () => run(id);

  if (status === 'Chamada') {
    return [
      { label: 'Rechamar', run: bind(recallTicket), className: TONES.blue },
      { label: 'Iniciar', run: bind(startTicket), className: TONES.emerald },
      { label: 'Ausente', run: bind(markTicketAbsent), className: TONES.amber },
      { label: 'Cancelar', run: bind(cancelTicket), className: TONES.slate },
    ];
  }

  if (status === 'EmAtendimento') {
    return [{ label: 'Finalizar', run: bind(finishTicket), className: TONES.emerald }];
  }

  if (status === 'Aguardando') {
    return [{ label: 'Cancelar', run: bind(cancelTicket), className: TONES.slate }];
  }

  return [];
}

export default function TicketActions({ id, status }: { id: string; status: QueueStatus }) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const actions = actionsFor(status, id);

  if (actions.length === 0) {
    return null;
  }

  const dispatch = (action: Action) => {
    setMessage(null);
    startTransition(async () => {
      const result = await action.run();

      if (result && result.message) {
        setMessage(result.message);
      }
    });
  };

  return (
    <div className="flex flex-col items-stretch gap-2 sm:items-end">
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            disabled={isPending}
            onClick={() => dispatch(action)}
            className={`rounded-xl border px-3 py-2 text-xs font-semibold transition disabled:opacity-50 ${action.className}`}
          >
            {action.label}
          </button>
        ))}
      </div>

      {message && (
        <p aria-live="polite" className="text-[11px] font-semibold text-red-600">
          {message}
        </p>
      )}
    </div>
  );
}
