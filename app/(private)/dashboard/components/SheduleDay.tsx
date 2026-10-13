'use client';
import { lusitana } from '@/app/components/ui/fonts';
import { Service } from '@/app/domains/services/types';
import { User } from '@/app/domains/users/types';
import { Client } from '@/app/domains/clients/types';
import { Type } from '@/app/domains/types/types';
import { Office } from '@/app/domains/offices/types';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import StatusBadge from '@/app/components/ui/status-badge';

export default function SheduleDay({
  services,
  users,
  clients,
  types,
  offices,
}: {
  services: Service[];
  users: User[];
  clients: Client[];
  types: Type[];
  offices: Office[];
}) {
  return (
    <div className="flex w-full items-center justify-between p-4">
      <div className="mx-auto flex w-full max-w-6xl flex-col rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] md:p-7">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <CalendarDaysIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-500">
                Agenda
              </p>
              <h1
                className={`${lusitana.className} text-2xl font-extrabold tracking-tight text-slate-900`}
              >
                Agenda de hoje
              </h1>
            </div>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-600">
            {services.length} {services.length === 1 ? 'horário' : 'horários'}
          </span>
        </div>
        {/* Desktop: tabela */}
        <div className="hidden w-full overflow-x-auto md:block">
          {services.length > 0 ? (
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-blue-100 text-blue-900">
                  <th className="px-3 py-3 text-left font-semibold">Horário</th>
                  <th className="px-3 py-3 text-left font-semibold">Paciente</th>
                  <th className="px-3 py-3 text-left font-semibold">Tipo</th>
                  <th className="px-3 py-3 text-left font-semibold">Sala</th>
                  <th className="px-3 py-3 text-left font-semibold">Profissional</th>
                  <th className="px-3 py-3 text-left font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {services.map((s) => {
                  const client = clients.find((c) => c.id === s.idclient);
                  const type = types.find((t) => t.id === s.idtype);
                  const user = users.find((u) => u.id === s.iduser);
                  const office = offices.find((o) => o.id === s.idoffice);

                  return (
                    <tr
                      key={s.id}
                      className="border-b border-slate-100 transition hover:bg-slate-50"
                    >
                      <td className="whitespace-nowrap px-3 py-3 font-semibold text-blue-800">
                        {s.starttime}
                        {s.endtime ? ` – ${s.endtime}` : ''}
                      </td>
                      <td className="px-3 py-3 font-medium text-slate-800">
                        {client?.pronoun || '-'} {client?.name || '-'}
                      </td>
                      <td className="px-3 py-3 text-slate-600">{type?.title || '-'}</td>
                      <td className="px-3 py-3 text-slate-600">{office?.title || '-'}</td>
                      <td className="px-3 py-3 text-slate-600">
                        {user?.pronoun} {user?.name || '-'}
                      </td>
                      <td className="px-3 py-3">
                        <StatusBadge status={s.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center gap-2 py-10 text-center text-slate-500">
              <CalendarDaysIcon className="h-8 w-8 text-slate-300" />
              <p className="text-sm font-medium">Sem agendamentos para hoje.</p>
            </div>
          )}
        </div>
        {/* Mobile: cards */}
        <div className="md:hidden w-full space-y-4">
          {services.length > 0 ? (
            services.map((s) => {
              const client = clients.find((c) => c.id === s.idclient);
              const type = types.find((t) => t.id === s.idtype);
              const user = users.find((u) => u.id === s.iduser);
              const office = offices.find((o) => o.id === s.idoffice);

              return (
                <div
                  key={s.id}
                  className="flex flex-col gap-1 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-lg font-bold text-blue-900">
                      {s.starttime}
                      {s.endtime ? ` – ${s.endtime}` : ''}
                    </span>
                    <StatusBadge status={s.status} />
                  </div>
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="truncate font-medium text-slate-800">
                      {client?.name || '-'}
                    </span>
                    <span className="rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
                      {type?.title || '-'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                    <span>{office?.title || '-'}</span>
                    <span>
                      {user?.pronoun} {user?.name || '-'}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-white/70 py-10 text-center text-slate-500">
              <CalendarDaysIcon className="h-8 w-8 text-slate-300" />
              <p className="text-sm font-medium">Sem agendamentos para hoje.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
