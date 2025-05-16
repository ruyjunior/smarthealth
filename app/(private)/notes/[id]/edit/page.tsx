import Form from '../../components/edit-form';
import Breadcrumbs from '@/app/components/ui/breadcrumbs';
import { fetchNoteById } from '@/app/query/notes/data';

import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { fetchClientById } from '@/app/query/clients/data';
import { fetchUsers } from '@/app/query/users/data';

export const metadata: Metadata = {
  title: 'Edit Notes',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const note = await fetchNoteById(id);
  const client = await fetchClientById(note.idclient);
  const users = await fetchUsers();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Paciente', href: `/clients` },
          { label: `Nota: ${client?.name}`, href: `/clients/${client.id}/view` },
          {
            label: 'Editar Nota',
            href: `/notes/${id}/edit`,
            active: true,
          }]}
      />
      <Form
        note={note}
        client={client}
        users={users}
      />
    </main>
  );
}