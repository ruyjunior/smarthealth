import { Suspense } from 'react';
import { getCurrentClinicId } from '@/app/lib/session';
import { Metadata } from 'next';
import Pagination from '@/app/components/ui/pagination';
import Table from './components/table';
import { GainsTableSkeleton } from './components/skeletons';
import { fetchServicesPages } from '@/app/domains/services/queries';
import { fetchFilteredServices } from '@/app/domains/services/queries';
import { fetchTypes } from '@/app/domains/types/queries';
import ListPageShell from '@/app/components/ui/list-page-shell';

export const metadata: Metadata = {
  title: 'Faturamento',
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
  const totalPages = await fetchServicesPages(idclinic, query);
  const services = await fetchFilteredServices(idclinic, query, currentPage);
  const typesServices = await fetchTypes(idclinic);

  return (
    <ListPageShell
      breadcrumbs={[
        { label: 'Gerência', href: '/manager' },
        { label: 'Ganhos', href: '/manager/gains', active: true },
      ]}
      eyebrow="Financeiro"
      title="Ganhos por atendimento"
      subtitle="Estimativa baseada nos preços atuais dos atendimentos concluídos."
      footer={<Pagination totalPages={totalPages} />}
    >
      <Suspense key={query + currentPage} fallback={<GainsTableSkeleton />}>
        <Table services={services} typesServices={typesServices} />
      </Suspense>
    </ListPageShell>
  );
}
