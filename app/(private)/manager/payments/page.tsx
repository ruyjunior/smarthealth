import { Suspense } from 'react';
import { Metadata } from 'next';
import Pagination from '@/app/components/ui/pagination';
import Table from './components/table';
import { PaymentsTableSkeleton } from './components/skeletons';
import { fetchPaymentsPages } from '@/app/query/payments/data';
import Breadcrumbs from '@/app/components/ui/breadcrumbs';
import { fetchFilteredPayments } from '@/app/query/payments/data';

export const metadata: Metadata = {
  title: 'Pagamentos',
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
  const totalPages = await fetchPaymentsPages(query);
  const payments = await fetchFilteredPayments(query, currentPage);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <Breadcrumbs
          breadcrumbs={[
            { label: 'Gerência', href: `/manager` },
            { label: 'Pagamentos', href: `/manager/payments`, active: true },
          ]}
        />
      </div>
      {<Suspense key={query + currentPage} fallback={<PaymentsTableSkeleton />}>
        <Table
          query={query}
          currentPage={currentPage}
          payments={payments}
        />
      </Suspense>}
      <div className="mt-5 flex w-full justify-center">
        {<Pagination totalPages={totalPages} />}
      </div>

    </div>
  );
}