import { Suspense } from 'react';
import { getCurrentClinicId } from '@/app/lib/session';
import { Metadata } from 'next';
import Table from './components/table';
import { TableSkeleton } from './components/skeletons';
import { fetchCredits } from '@/app/domains/credit/queries';
import CreditComponent from './components/creditComponent';
import PricingTable from '@/app/(public)/plans/pricingTable';
import ListPageShell from '@/app/components/ui/list-page-shell';

export const metadata: Metadata = {
  title: 'Conta',
};

export default async function Page() {
  const idclinic = await getCurrentClinicId();
  const credits = await fetchCredits(idclinic);

  return (
    <ListPageShell
      breadcrumbs={[
        { label: 'Gerência', href: '/manager' },
        { label: 'Conta', href: '/manager/account', active: true },
      ]}
      eyebrow="Gerência"
      title="Conta e créditos"
      subtitle="Acompanhe seu plano, créditos disponíveis e opções de assinatura."
    >
      <Suspense fallback={<TableSkeleton />}>
        <div className="mx-auto mt-6 max-w-7xl space-y-6">
          <CreditComponent credits={credits} />
          <Table credits={credits} />
          <PricingTable />
        </div>
      </Suspense>
    </ListPageShell>
  );
}
