import { Suspense } from 'react';
import { getCurrentClinicId } from '@/app/lib/session';
import { Metadata } from 'next';
import Pagination from '@/app/components/ui/pagination';
import Search from '@/app/components/ui/search';
import Table from './components/table';
import { CreateOffice } from './components/buttons';
import { OfficesTableSkeleton } from './components/skeletons';
import { fetchOfficesPages } from '@/app/domains/offices/queries';
import ListPageShell from '@/app/components/ui/list-page-shell';

export const metadata: Metadata = {
  title: 'Consultórios',
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
  const totalPages = await fetchOfficesPages(idclinic, query);

  return (
    <ListPageShell
      breadcrumbs={[
        { label: 'Gerência', href: '/manager' },
        { label: 'Consultórios', href: '/manager/offices', active: true },
      ]}
      eyebrow="Gerência"
      title="Consultórios"
      subtitle="Salas e consultórios disponíveis para os atendimentos."
      action={<CreateOffice />}
      search={<Search placeholder="Procurar consultório..." />}
      footer={<Pagination totalPages={totalPages} />}
    >
      <Suspense key={query + currentPage} fallback={<OfficesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
    </ListPageShell>
  );
}
