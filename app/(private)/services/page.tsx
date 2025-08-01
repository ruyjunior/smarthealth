import { Suspense } from 'react';
import { Metadata } from 'next';
import Pagination from '@/app/components/ui/pagination';
import Search from '@/app/components/ui/search';
import Table from './components/table';
import CalendarView from './components/calendarView';
import { CreateService } from './components/buttons';
import { ServicesTableSkeleton } from './components/skeletons';
import { lusitana } from '@/app/components/ui/fonts';
import { fetchServicesPages } from '@/app/query/services/data';
import { ServiceWithDetails } from '@/app/query/services/definitions';
import { fetchClients } from '@/app/query/clients/data';
import { fetchOffices } from '@/app/query/offices/data';
import { fetchTypes } from '@/app/query/types/data';
import { fetchUsers } from '@/app/query/users/data';
import { fetchServices } from '@/app/query/services/data';

export const metadata: Metadata = {
  title: 'Agenda',
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchServicesPages(query);

  const services = await fetchServices();
  const clients = await fetchClients();
  const offices = await fetchOffices();
  const types = await fetchTypes();
  const users = await fetchUsers();

  const ServicesData: ServiceWithDetails[] = services.map((service) => {
    const user = users.find((u) => u.id === service.iduser) || { name: 'Unknown User' };
    const client = clients.find((c) => c.id === service.idclient) || { name: 'Unknown Client', pronoun: 'Unknown Pronoun' };
    const office = offices.find((o) => o.id === service.idoffice) || { title: 'Unknown Office' };
    const type = types.find((t) => t.id === service.idtype) || { title: 'Unknown Type' };

    return {
      ...service,
      user,
      client,
      office,
      type,
    };
  });


  return (
    <div className="w-full">
      <div className="items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Agenda</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Procurar..." />
        <CreateService />
      </div>
      {<Suspense key={query + currentPage} fallback={<ServicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>}
      <div className="mt-5 flex w-full justify-center">
        {<Pagination totalPages={totalPages} />}
      </div>
    </div>
  );
}