import { Suspense } from 'react';
import { Metadata } from 'next';
import Pagination from '@/app/components/ui/pagination';
import Search from '@/app/components/ui/search';
import Table from './components/table';
import { CreateUser } from './components/buttons';
import { UsersTableSkeleton } from './components/skeletons';
import { fetchUsersPages } from '@/app/query/users/data';
import Breadcrumbs from '@/app/components/ui/breadcrumbs';

export const metadata: Metadata = {
  title: 'Usuários',
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    success?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchUsersPages(query);

  let successMsg = '';
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    successMsg = params.get('success') || '';
  } else if (searchParams?.success) {
    successMsg = searchParams.success;
  }
  return (
    <div className="w-full">
      {successMsg && (
        <div className="mb-4 w-full rounded-lg bg-green-100 border border-green-300 text-green-800 px-4 py-3 text-center font-semibold shadow">
          {successMsg}
        </div>
      )}
      <div className="flex w-full items-center justify-between">
        <Breadcrumbs
          breadcrumbs={[
            { label: 'Gerência', href: `/manager` },
            { label: 'Usuários', href: `/manager/users`, active: true },
          ]}
        />
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Procurar..." />
        <CreateUser />
      </div>
      {<Suspense key={query + currentPage} fallback={<UsersTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>}
      <div className="mt-5 flex w-full justify-center">
        {<Pagination totalPages={totalPages} />}
      </div>
    </div>
  );
}