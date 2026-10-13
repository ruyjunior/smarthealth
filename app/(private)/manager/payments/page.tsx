import { Suspense } from 'react';
import { getCurrentClinicId } from '@/app/lib/session';
import { Metadata } from 'next';
import Pagination from '@/app/components/ui/pagination';
import Table from './components/table';
import { PaymentsTableSkeleton } from './components/skeletons';
import { fetchPaymentsPages } from '@/app/domains/payments/queries';
import { fetchFilteredPayments } from '@/app/domains/payments/queries';
import ListPageShell from '@/app/components/ui/list-page-shell';

export const metadata: Metadata = {
  title: 'Pagamentos',
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
  const totalPages = await fetchPaymentsPages(idclinic, query);
  const payments = await fetchFilteredPayments(idclinic, query, currentPage);

  return (
    <ListPageShell
      breadcrumbs={[
        { label: 'Gerência', href: '/manager' },
        { label: 'Pagamentos', href: '/manager/payments', active: true },
      ]}
      eyebrow="Financeiro"
      title="Pagamentos"
      subtitle="Lançamentos financeiros registrados pela clínica."
      footer={<Pagination totalPages={totalPages} />}
    >
      <Suspense key={query + currentPage} fallback={<PaymentsTableSkeleton />}>
        <Table payments={payments} />
      </Suspense>
    </ListPageShell>
  );
}
