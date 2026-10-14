import type { QueueStatus, QueueTicketWithDetails } from '@/app/domains/queues/types';
import TicketActions from './ticket-actions';

const STATUS_LABEL: Record<QueueStatus, string> = {
  Aguardando: 'Aguardando',
  Chamada: 'Chamada',
  EmAtendimento: 'Em atendimento',
  Finalizada: 'Finalizada',
  Ausente: 'Ausente',
  Cancelada: 'Cancelada',
};

const STATUS_TONE: Record<QueueStatus, string> = {
  Aguardando: 'border-slate-200 bg-slate-50 text-slate-600',
  Chamada: 'border-blue-200 bg-blue-50 text-blue-700',
  EmAtendimento: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Finalizada: 'border-emerald-100 bg-emerald-50/60 text-emerald-700',
  Ausente: 'border-amber-200 bg-amber-50 text-amber-700',
  Cancelada: 'border-slate-200 bg-slate-100 text-slate-500',
};

/** `Sra. Maria Souza`, como a recepção chama o paciente. Nulo = senha de primeiro atendimento. */
function patientName(ticket: QueueTicketWithDetails) {
  if (!ticket.client) {
    return 'Não cadastrado';
  }

  return ticket.client.pronoun
    ? `${ticket.client.pronoun} ${ticket.client.name}`
    : ticket.client.name;
}

function clock(date: Date | null) {
  return date ? date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '—';
}

function minutesSince(date: Date) {
  return Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / 60_000));
}

function Badge({ status }: { status: QueueStatus }) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_TONE[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

function TicketFacts({ ticket }: { ticket: QueueTicketWithDetails }) {
  return (
    <div>
      <p className="text-lg font-extrabold text-slate-900">
        <span className="font-mono">{ticket.code}</span> · {patientName(ticket)}
        {ticket.priority && (
          <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-amber-700">
            {ticket.priorityreason ?? 'Preferencial'}
          </span>
        )}
      </p>
      <p className="mt-1 text-xs text-slate-500">
        {ticket.type?.title ?? 'Serviço removido'} ·{' '}
        {ticket.office?.title ? `Sala: ${ticket.office.title}` : 'Sala não informada'} · emitida às{' '}
        {clock(ticket.createdat)}
      </p>
    </div>
  );
}

export default function QueueBoard({ tickets }: { tickets: QueueTicketWithDetails[] }) {
  const inProgress = tickets.filter(
    (ticket) => ticket.status === 'Chamada' || ticket.status === 'EmAtendimento',
  );
  const waiting = tickets.filter((ticket) => ticket.status === 'Aguardando');
  const closed = tickets.filter(
    (ticket) =>
      ticket.status === 'Finalizada' ||
      ticket.status === 'Ausente' ||
      ticket.status === 'Cancelada',
  );

  return (
    <div className="mx-auto mt-6 flex max-w-7xl flex-col gap-6">
      <section className="rounded-[1.5rem] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 shadow-[0_25px_80px_rgba(59,130,246,0.08)] md:p-5">
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
          Em atendimento agora
        </h2>

        {inProgress.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">
            Nenhuma senha chamada até agora. Use <strong>Chamar próximo</strong> para começar.
          </p>
        ) : (
          <ul className="mt-4 flex flex-col gap-3">
            {inProgress.map((ticket) => (
              <li
                key={ticket.id}
                className="flex flex-col gap-3 rounded-2xl border-2 border-blue-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <TicketFacts ticket={ticket} />
                  <p className="mt-2 text-xs text-slate-500">
                    {ticket.status === 'EmAtendimento'
                      ? `Em atendimento desde ${clock(ticket.startedat)}`
                      : `Chamado às ${clock(ticket.calledat)}${ticket.calledat ? ` · há ${minutesSince(ticket.calledat)} min` : ''}`}
                  </p>
                  <div className="mt-2">
                    <Badge status={ticket.status} />
                  </div>
                </div>
                <TicketActions id={ticket.id} status={ticket.status} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-[0_18px_50px_rgba(148,163,184,0.12)] md:p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
            Aguardando ({waiting.length})
          </h2>
          <p className="text-xs text-slate-500">Ordenado por preferência e chegada</p>
        </div>

        {waiting.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">Ninguém na fila neste momento.</p>
        ) : (
          <ol className="mt-4 flex flex-col divide-y divide-slate-100">
            {waiting.map((ticket, index) => (
              <li
                key={ticket.id}
                className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-4">
                  <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
                    {index + 1}
                  </span>
                  <div>
                    <TicketFacts ticket={ticket} />
                    <p className="mt-1 text-xs text-amber-700">
                      esperando há {minutesSince(ticket.createdat)} min
                    </p>
                  </div>
                </div>
                <TicketActions id={ticket.id} status={ticket.status} />
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="rounded-[1.5rem] border border-slate-200 bg-white p-4 md:p-5">
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
          Encerradas hoje ({closed.length})
        </h2>

        {closed.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">Nenhuma senha encerrada ainda.</p>
        ) : (
          <ul className="mt-4 flex flex-col divide-y divide-slate-100">
            {closed.map((ticket) => (
              <li
                key={ticket.id}
                className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <TicketFacts ticket={ticket} />
                  <p className="mt-1 text-xs text-slate-500">
                    encerrada às {clock(ticket.finishedat ?? ticket.calledat)}
                    {ticket.user?.name ? ` · por ${ticket.user.name}` : ''}
                  </p>
                </div>
                <Badge status={ticket.status} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
