'use client';
import {
  UserGroupIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  StarIcon,
  NewspaperIcon,
} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/components/ui/fonts';
import { Service } from '@/app/domains/services/types';
import { Type } from '@/app/domains/types/types';
import { formatCurrency } from '@/app/lib/utils';

export default function ResumeWeek({ services, types }: { services: Service[]; types: Type[] }) {
  const totalDoneServices = services.filter((s) => s.status === 'Feito').length;
  const totalEmptyServices = services.filter((s) => s.status === 'Vazia').length;
  const serviceCounts = services.reduce<Map<string, number>>((counts, service) => {
    if (service.status === 'Marcada' || service.status === 'Feito') {
      counts.set(service.idtype, (counts.get(service.idtype) ?? 0) + 1);
    }
    return counts;
  }, new Map());
  const popularServices = Array.from(serviceCounts, ([typeId, count]) => ({
    id: typeId,
    title: types.find((type) => type.id === typeId)?.title ?? 'Tipo não encontrado',
    count,
  }))
    .sort((a, b) => b.count - a.count || a.title.localeCompare(b.title, 'pt-BR'))
    .slice(0, 3);

  const estimatedRevenue = services
    .filter((service) => service.status === 'Feito')
    .reduce((acc, service) => {
      const type = types.find((t) => t.id === service.idtype);
      return acc + (type ? Number(type.price) : 0);
    }, 0);

  return (
    <div className="flex w-full items-center justify-between p-2 md:p-4">
      <div className="mx-auto flex w-full max-w-6xl flex-col rounded-[2rem] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-5 shadow-[0_20px_60px_rgba(37,99,235,0.08)] md:p-7">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 shadow-inner shadow-indigo-200">
              <NewspaperIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500">
                Resumo
              </p>
              <h1
                className={`${lusitana.className} text-2xl font-extrabold tracking-tight text-blue-900`}
              >
                Resumo semanal
              </h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[1.5rem] border border-blue-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <UserGroupIcon className="h-8 w-8 text-blue-500" />
              <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">
                Feitos
              </span>
            </div>
            <h2 className="text-sm font-semibold text-slate-500">Atendimentos realizados</h2>
            <p className="mt-3 text-3xl font-extrabold text-blue-700">{totalDoneServices}</p>
          </div>

          <div className="rounded-[1.5rem] border border-emerald-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <CalendarIcon className="h-8 w-8 text-emerald-500" />
              <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                Livres
              </span>
            </div>
            <h2 className="text-sm font-semibold text-slate-500">Horários vagos</h2>
            <p className="mt-3 text-3xl font-extrabold text-emerald-700">{totalEmptyServices}</p>
          </div>

          <div className="rounded-[1.5rem] border border-amber-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <StarIcon className="h-8 w-8 text-amber-500" />
              <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">
                Esta semana
              </span>
            </div>
            <h2 className="text-sm font-semibold text-slate-500">Tipos mais agendados</h2>
            {popularServices.length > 0 ? (
              <ol className="mt-3 space-y-2 text-sm text-slate-700">
                {popularServices.map(({ id, title, count }) => (
                  <li key={id} className="flex items-center justify-between gap-2">
                    <span className="truncate font-medium">{title}</span>
                    <span className="shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700">
                      {count} {count === 1 ? 'atendimento' : 'atendimentos'}
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-3 text-sm text-slate-500">
                Nenhum atendimento agendado nesta semana.
              </p>
            )}
          </div>

          <div className="rounded-[1.5rem] border border-violet-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <CurrencyDollarIcon className="h-8 w-8 text-violet-500" />
              <span className="rounded-full bg-violet-50 px-2 py-1 text-xs font-semibold text-violet-700">
                Estimativa
              </span>
            </div>
            <h2 className="text-sm font-semibold text-slate-500">
              Valor dos atendimentos concluídos
            </h2>
            <p className="mt-3 text-2xl font-extrabold text-violet-700">
              {formatCurrency(estimatedRevenue)}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              Calculado pelos preços atuais dos serviços; não representa pagamentos recebidos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
