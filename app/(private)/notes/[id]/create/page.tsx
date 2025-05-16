import Form from '../../components/create-form';
import Breadcrumbs from '@/app/components/ui/breadcrumbs';
import { fetchClientById } from '@/app/query/clients/data';
import { fetchUsers } from '@/app/query/users/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Creat Note',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const client = await fetchClientById(id);
  const users = await fetchUsers();
      

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Pacientes', href: `/clients` },
          { label: `Paciente: ${client.name}`, href: `/clients/${id}/view` },
          {
            label: 'Criar Nota',
            href: `/notes/${id}/create`,
            active: true,
          },
        ]}
      />
      <Form
        client={client}
        users={users}
      />
    </main>
  );
}