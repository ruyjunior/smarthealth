import { Suspense } from 'react';
import { Metadata } from 'next';
import Table from './components/table';
import { ClinicsTableSkeleton } from './components/skeletons';
import { fetchClinicsPages } from '@/app/query/clinics/data';
import Breadcrumbs from '@/app/components/ui/breadcrumbs';


export const metadata: Metadata = {
  title: 'Clínica',
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
  const totalPages = await fetchClinicsPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <Breadcrumbs
          breadcrumbs={[
            { label: 'Gerência', href: `/manager` },
            { label: 'Clínica', href: `/manager/clinics`, active: true },
          ]}
        />
      </div>
      {<Suspense key={query + currentPage} fallback={<ClinicsTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>}
    </div>
  );
}