import Form from '../components/create-form';
import Breadcrumbs from '@/app/components/ui/breadcrumbs';
import { fetchClients } from '@/app/query/clients/data';
import { fetchOffices } from '@/app/query/offices/data';
import { fetchTypes } from '@/app/query/types/data';
import { fetchUsers } from '@/app/query/users/data';
import { Metadata } from 'next';
import { auth } from '@/app/lib/auth';
import { fetchUserById } from '@/app/query/users/data';


export const metadata: Metadata = {
  title: 'Novo Agendamento',
};

export default async function Page() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error('User session is not available.');
  }
  const user = await fetchUserById(session.user.id);


  const clients = await fetchClients();
  const offices = await fetchOffices();
  const types = await fetchTypes();
  const users = await fetchUsers();

  const data = {
    clients, offices, types, users, idclinic: user.idclinic
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