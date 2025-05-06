import { Suspense } from 'react';
import { Metadata } from 'next';
import Pagination from '@/app/components/ui/pagination';
import Search from '@/app/components/ui/search';
import Table from './components/table';
import { CreateType } from './components/buttons';
import { TypesTableSkeleton } from './components/skeletons';
import { lusitana } from '@/app/components/ui/fonts';
import { fetchTypesPages } from '@/app/query/types/data';


export const metadata: Metadata = {
  title: 'Especialidades',
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
    const totalPages = await fetchTypesPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Especialidades</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search..." />
        <CreateType />
      </div>
      {<Suspense key={query + currentPage} fallback={<TypesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense> }
      <div className="mt-5 flex w-full justify-center">
        {<Pagination totalPages={totalPages} /> }
      </div>
    </div>
  );
}