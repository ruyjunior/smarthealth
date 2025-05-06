import { Suspense } from 'react';
import { Metadata } from 'next';
import Pagination from '@/app/components/ui/pagination';
import Search from '@/app/components/ui/search';
import Table from './components/table';
import { CreateUser } from './components/buttons';
import { UsersTableSkeleton } from './components/skeletons';
import { lusitana } from '@/app/components/ui/fonts';
import { fetchUsersPages } from '@/app/query/users/data';


export const metadata: Metadata = {
  title: 'Perfil',
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
    const totalPages = await fetchUsersPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Perfil</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search..." />
        <CreateUser />
      </div>
      {<Suspense key={query + currentPage} fallback={<UsersTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense> }
      <div className="mt-5 flex w-full justify-center">
        {<Pagination totalPages={totalPages} /> }
      </div>
    </div>
  );
}