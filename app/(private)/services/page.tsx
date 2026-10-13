import { Suspense } from 'react';
import { getCurrentClinicId } from '@/app/lib/session';
import { Metadata } from 'next';
import Pagination from '@/app/components/ui/pagination';
import Search from '@/app/components/ui/search';
import Table from './components/table';
import CalendarView from './components/calendarView';
import AgendaTabs from './components/agenda-tabs';
import { CreateService } from './components/buttons';
import { ServicesTableSkeleton } from './components/skeletons';
import { lusitana } from '@/app/components/ui/fonts';
import { fetchServices, fetchServicesPages } from '@/app/domains/services/queries';
import { ServiceWithDetails } from '@/app/domains/services/types';
import { fetchClients } from '@/app/domains/clients/queries';
import { fetchOffices } from '@/app/domains/offices/queries';
import { fetchTypes } from '@/app/domains/types/queries';
import { fetchUsers } from '@/app/domains/users/queries';

export const metadata: Metadata = {
  title: 'Agenda',
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const idclinic = await getCurrentClinicId();
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const [totalPages, services, clients, offices, types, users] = await Promise.all([
    fetchServicesPages(idclinic, query),
    fetchServices(idclinic),
    fetchClients(idclinic),
    fetchOffices(idclinic),
    fetchTypes(idclinic),
    fetchUsers(idclinic),
  ]);

  const servicesWithDetails: ServiceWithDetails[] = services.map((service) => ({
    ...service,
    client: clients.find((c) => c.id === service.idclient) ?? {
      name: 'Paciente removido',
      pronoun: '',
    },
    office: offices.find((o) => o.id === service.idoffice) ?? { title: 'Sem consultório' },
    type: types.find((t) => t.id === service.idtype) ?? { title: 'Sem tipo' },
    user: users.find((u) => u.id === service.iduser) ?? { name: 'Não informado' },
  }));

  return (
    <div className="w-full px-2 py-4 md:px-4">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-blue-100 bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-900 p-6 shadow-[0_25px_80px_rgba(37,99,235,0.18)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">Agenda</p>
            <h1 className={`${lusitana.className} mt-2 text-3xl font-extrabold text-white`}>
              Agendamentos
            </h1>
          </div>

          <CreateService />
        </div>
      </div>

      <div className="mx-auto mt-6 max-w-7xl">
        <AgendaTabs
          list={
            <div className="space-y-4">
              <div className="rounded-[1.5rem] border border-slate-200 bg-white/80 p-4 shadow-[0_20px_60px_rgba(148,163,184,0.14)] backdrop-blur-sm md:p-5">
                <Search placeholder="Procurar agendamento..." />
              </div>

              <Suspense key={query + currentPage} fallback={<ServicesTableSkeleton />}>
                <Table query={query} currentPage={currentPage} />
              </Suspense>

              <div className="flex w-full justify-center">
                <Pagination totalPages={totalPages} />
              </div>
            </div>
          }
          calendar={<CalendarView services={servicesWithDetails} />}
        />
      </div>
    </div>
  );
}
