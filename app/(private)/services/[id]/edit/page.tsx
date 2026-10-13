import Form from '../../components/edit-form';
import { getCurrentClinicId } from '@/app/lib/session';
import Breadcrumbs from '@/app/components/ui/breadcrumbs';
import { fetchServiceById } from '@/app/domains/services/queries';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { fetchClients } from '@/app/domains/clients/queries';
import { fetchOffices } from '@/app/domains/offices/queries';
import { fetchTypes } from '@/app/domains/types/queries';
import { fetchUsers } from '@/app/domains/users/queries';

export const metadata: Metadata = {
  title: 'Editar Agendamento',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const idclinic = await getCurrentClinicId();
  const params = await props.params;
  const id = params.id;
  const [service] = await Promise.all([fetchServiceById(idclinic, id)]);
  if (!service) {
    notFound();
  }

  const clients = await fetchClients(idclinic);
  const offices = await fetchOffices(idclinic);
  const types = await fetchTypes(idclinic);
  const users = await fetchUsers(idclinic);

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
            label: 'Editar Agendamento',
            href: `/services/${id}/edit`,
            active: true,
          },
        ]}
      />
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-blue-100 bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-900 p-6 shadow-[0_25px_80px_rgba(37,99,235,0.16)]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">Agenda</p>
        <h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">Editar agendamento</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-blue-100 sm:text-base">
          Atualize a situação, o horário ou os dados do atendimento.
        </p>
      </div>
      <Form service={service} data={data} />
    </main>
  );
}
