import { Suspense } from 'react';
import { getCurrentClinicId } from '@/app/lib/session';
import { Metadata } from 'next';
import Pagination from '@/app/components/ui/pagination';
import Search from '@/app/components/ui/search';
import Table from './components/table';
import { CreateType } from './components/buttons';
import { TypesTableSkeleton } from './components/skeletons';
import { fetchTypesPages } from '@/app/domains/types/queries';
import ListPageShell from '@/app/components/ui/list-page-shell';

export const metadata: Metadata = {
  title: 'Especialidades',
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
  const totalPages = await fetchTypesPages(idclinic, query);

  return (
    <ListPageShell
      breadcrumbs={[
        { label: 'Gerência', href: '/manager' },
        { label: 'Especialidades', href: '/manager/types', active: true },
      ]}
      eyebrow="Gerência"
      title="Especialidades"
      subtitle="Tipos de atendimento oferecidos pela clínica, com seus valores."
      action={<CreateType />}
      search={<Search placeholder="Procurar especialidade..." />}
      footer={<Pagination totalPages={totalPages} />}
    >
      <Suspense key={query + currentPage} fallback={<TypesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
    </ListPageShell>
  );
}
