import Form from '../components/create-form';
import Breadcrumbs from '@/app/components/ui/breadcrumbs';
import { fetchClients } from '@/app/query/clients/data';
import { fetchOffices } from '@/app/query/offices/data';
import { fetchTypes } from '@/app/query/types/data';
import { fetchUsers } from '@/app/query/users/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Novo Agendamento',
};

export default async function Page() {

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
          { label: 'Agenda', href: '/services' },
          {
            label: 'Novo Agendamento',
            href: '/services/create',
            active: true,
          },
        ]}
      />
      <Form data={data} />
    </main>
  );
}