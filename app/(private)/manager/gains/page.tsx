import { Suspense } from 'react';
import { Metadata } from 'next';
import Pagination from '@/app/components/ui/pagination';
import Table from './components/table';
import { GainsTableSkeleton } from './components/skeletons';
import { fetchServicesPages } from '@/app/query/services/data';
import Breadcrumbs from '@/app/components/ui/breadcrumbs';
import { fetchFilteredServices } from '@/app/query/services/data';
import { fetchTypes } from '@/app/query/types/data';
import { fetchUsers } from '@/app/query/users/data';

export const metadata: Metadata = {
  title: 'Faturamento',
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
  const services = await fetchFilteredServices(query, currentPage);
  const typesServices = await fetchTypes();
  const users = await fetchUsers();

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <Breadcrumbs
          breadcrumbs={[
            { label: 'Gerência', href: `/manager` },
            { label: 'Ganhos', href: `/manager/gains`, active: true },
          ]}
        />
      </div>
      {<Suspense key={query + currentPage} fallback={<GainsTableSkeleton />}>
        <Table
          query={query}
          currentPage={currentPage}
          services={services}
          typesServices={typesServices}
          users={users}
        />
      </Suspense>}
      <div className="mt-5 flex w-full justify-center">
        {<Pagination totalPages={totalPages} />}
      </div>
    </div>
  );
}