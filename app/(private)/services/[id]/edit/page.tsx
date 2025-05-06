import Form from '../../components/edit-form';
import Breadcrumbs from '@/app/components/ui/breadcrumbs';
import { fetchServiceById } from '@/app/query/services/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { fetchClients } from '@/app/query/clients/data';
import { fetchOffices } from '@/app/query/offices/data';
import { fetchTypes } from '@/app/query/types/data';
import { fetchUsers } from '@/app/query/users/data';


export const metadata: Metadata = {
  title: 'Editar Agendamento',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const [service] = await Promise.all([
    fetchServiceById(id),
  ]);
  if (!service) {
    notFound();
  }

  const clients = await fetchClients();
  const offices = await fetchOffices();
  const types = await fetchTypes();
  const users = await fetchUsers();

  const data = {
    clients, offices, types, users,
  };


  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Agenda', href: `/services` },
          {
            label: 'Editar Agendamento',
            href: `/service/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form service={service} data={data} />
    </main>
  );
}