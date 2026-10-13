import Form from '../components/create-form';
import { requireSessionUser } from '@/app/lib/session';
import Breadcrumbs from '@/app/components/ui/breadcrumbs';
import { fetchClients } from '@/app/domains/clients/queries';
import { fetchOffices } from '@/app/domains/offices/queries';
import { fetchTypes } from '@/app/domains/types/queries';
import { fetchUsers } from '@/app/domains/users/queries';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Novo Agendamento',
};

export default async function Page() {
  const user = await requireSessionUser();

  const clients = await fetchClients(user.idclinic);
  const offices = await fetchOffices(user.idclinic);
  const types = await fetchTypes(user.idclinic);
  const users = await fetchUsers(user.idclinic);

  const data = {
    clients,
    offices,
    types,
    users,
  };

  return (
    <main className="space-y-6 px-2 py-4 md:px-4">
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
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-blue-100 bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-900 p-6 shadow-[0_25px_80px_rgba(37,99,235,0.16)]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">Agenda</p>
        <h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">Novo agendamento</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-blue-100 sm:text-base">
          Selecione especialidade, profissional, consultório e paciente para reservar o horário.
        </p>
      </div>
      <Form data={data} />
    </main>
  );
}
