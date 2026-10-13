import { Suspense } from 'react';
import { getCurrentClinicId } from '@/app/lib/session';
import { Metadata } from 'next';
import Table from './components/table';
import { ClinicsTableSkeleton } from './components/skeletons';
import { fetchClinicsPages } from '@/app/domains/clinics/queries';
import ListPageShell from '@/app/components/ui/list-page-shell';

export const metadata: Metadata = {
  title: 'Clínica',
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
  await fetchClinicsPages(idclinic, query);

  return (
    <ListPageShell
      breadcrumbs={[
        { label: 'Gerência', href: '/manager' },
        { label: 'Clínica', href: '/manager/clinics', active: true },
      ]}
      eyebrow="Gerência"
      title="Clínica"
      subtitle="Dados cadastrais e configurações da clínica."
    >
      <Suspense key={query + currentPage} fallback={<ClinicsTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
    </ListPageShell>
  );
}
