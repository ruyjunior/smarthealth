import Form from '../../components/create-form';
import Breadcrumbs from '@/app/components/ui/breadcrumbs';
import { fetchClientById } from '@/app/query/clients/data';
import { fetchUsers } from '@/app/query/users/data';
import { fetchNoteTypes } from '@/app/query/notetypes/data';
import { Metadata } from 'next';
import { auth } from '@/app/lib/auth';
import { fetchUserById } from '@/app/query/users/data';

export const metadata: Metadata = {
  title: 'Creat Note',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const client = await fetchClientById(id);
  const types = await fetchNoteTypes();
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error('User session is not available.');
  }
  const user = await fetchUserById(session.user.id);


  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Pacientes', href: `/clients` },
          { label: `Paciente: ${client.name}`, href: `/clients/${id}/view` },
          {
            label: 'Criar Ficha',
            href: `/notes/${id}/create`,
            active: true,
          },
        ]}
      />
      <Form
        client={client}
        user={user}
        types={types}
      />
    </main>
  );
}