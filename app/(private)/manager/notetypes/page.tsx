import { Suspense } from 'react';
import { getCurrentClinicId } from '@/app/lib/session';
import { Metadata } from 'next';
import Pagination from '@/app/components/ui/pagination';
import Search from '@/app/components/ui/search';
import Table from './components/table';
import { CreateNoteType } from './components/buttons';
import { NoteTypesTableSkeleton } from './components/skeletons';
import { fetchNoteTypesPages } from '@/app/domains/notetypes/queries';
import ListPageShell from '@/app/components/ui/list-page-shell';

export const metadata: Metadata = {
  title: 'Fichas',
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
  const totalPages = await fetchNoteTypesPages(idclinic, query);

  return (
    <ListPageShell
      breadcrumbs={[
        { label: 'Gerência', href: '/manager' },
        { label: 'Fichas', href: '/manager/notetypes', active: true },
      ]}
      eyebrow="Gerência"
      title="Fichas clínicas"
      subtitle="Modelos de ficha e seus campos personalizados."
      action={<CreateNoteType />}
      search={<Search placeholder="Procurar ficha..." />}
      footer={<Pagination totalPages={totalPages} />}
    >
      <Suspense key={query + currentPage} fallback={<NoteTypesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
    </ListPageShell>
  );
}
