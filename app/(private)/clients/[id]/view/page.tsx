import NotesTable from '@/app/(private)/notes/components/table';
import ClientsTable from '@/app/(private)/clients/components/table';
import { CreateNote } from '@/app/(private)/notes/components/buttons';
import { Suspense } from 'react';
import Breadcrumbs from '@/app/components/ui/breadcrumbs';
import { fetchClientById } from '@/app/query/clients/data';
import { fetchNotesByClient } from '@/app/query/notes/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Client View',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const [client, notes] = await Promise.all([
    fetchClientById(id),
    fetchNotesByClient(id),
  ]);
  if (!client) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Pacientes', href: '/clients' },
          {
            label: 'Paciente: ' + client.name,
            href: `/clients/${id}/view`,
            active: true,
          },
        ]}
      />
      <ClientsTable query={id} currentPage={null} />
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <CreateNote id={id}/>
      </div>
      <NotesTable query={id} currentPage={null} />
    </main>
  );
}