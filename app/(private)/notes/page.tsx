import { Suspense } from 'react';
import { Metadata } from 'next';
import Pagination from '@/app/components/ui/pagination';
import Search from '@/app/components/ui/search';
import Table from './components/table';
import { CreateNote } from './components/buttons';
import { NotesTableSkeleton } from './components/skeletons';
import { lusitana } from '@/app/components/ui/fonts';
import { fetchNotesPages } from '@/app/domains/notes/queries';
import { getCurrentClinicId } from '@/app/lib/session';

export const metadata: Metadata = {
  title: 'Fichas clínicas',
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
  const idclinic = await getCurrentClinicId();
  const totalPages = await fetchNotesPages(idclinic, query);

  return (
    <div className="w-full px-2 py-4 md:px-4">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-blue-100 bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-900 p-6 shadow-[0_25px_80px_rgba(37,99,235,0.18)]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">Prontuário</p>
        <h1 className={`${lusitana.className} mt-2 text-3xl font-extrabold text-white`}>
          Fichas clínicas
        </h1>
      </div>
      <div className="mx-auto mt-6 flex max-w-7xl items-center justify-between gap-3 rounded-[1.5rem] border border-slate-200 bg-white/80 p-4 shadow-[0_20px_60px_rgba(148,163,184,0.14)] backdrop-blur-sm md:p-5">
        <Search placeholder="Procurar ficha..." />
        <CreateNote id="" />
      </div>
      {
        <Suspense key={query + currentPage} fallback={<NotesTableSkeleton />}>
          <Table query={query} currentPage={currentPage} />
        </Suspense>
      }
      <div className="mt-5 flex w-full justify-center">
        {<Pagination totalPages={totalPages} />}
      </div>
    </div>
  );
}
