import { Suspense } from 'react';
import { Metadata } from 'next';
import Pagination from '@/app/components/ui/pagination';
import Search from '@/app/components/ui/search';
import Table from './components/table';
import { CreateNoteType } from './components/buttons';
import { NoteTypesTableSkeleton } from './components/skeletons';
import { lusitana } from '@/app/components/ui/fonts';
import { fetchNoteTypesPages } from '@/app/query/notetypes/data';
import Breadcrumbs from '@/app/components/ui/breadcrumbs';

export const metadata: Metadata = {
  title: 'Fichas',
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
    const totalPages = await fetchNoteTypesPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <Breadcrumbs
          breadcrumbs={[
            { label: 'Gerência', href: `/manager` },
            { label: 'Fichas', href: `/manager/notetypes`, active: true },
          ]}
        />
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Procurar..." />
        <CreateNoteType />
      </div>
      {<Suspense key={query + currentPage} fallback={<NoteTypesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense> }
      <div className="mt-5 flex w-full justify-center">
        {<Pagination totalPages={totalPages} /> }
      </div>
    </div>
  );
}