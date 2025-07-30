import { Suspense } from 'react';
import { Metadata } from 'next';
import Table from './components/table';
import { TableSkeleton } from './components/skeletons';
import Breadcrumbs from '@/app/components/ui/breadcrumbs';
import { fetchCredits } from '@/app/query/credit/data';


export const metadata: Metadata = {
  title: 'Conta',
};

export default async function Page() {
    const credits = await fetchCredits();

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <Breadcrumbs
          breadcrumbs={[
            { label: 'Gerência', href: `/manager` },
            { label: 'Conta', href: `/manager/account`, active: true },
          ]}
        />
      </div>
      {<Suspense fallback={<TableSkeleton />}>
        <Table credits={credits} />
      </Suspense>}
    </div>
  );
}