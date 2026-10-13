import Form from '../../components/create-form';
import { requireSessionUser } from '@/app/lib/session';
import Breadcrumbs from '@/app/components/ui/breadcrumbs';
import { fetchClientById } from '@/app/domains/clients/queries';
import { fetchNoteTypes } from '@/app/domains/notetypes/queries';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Nova ficha clínica',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const user = await requireSessionUser();
  const id = params.id;

  const client = await fetchClientById(user.idclinic, id);
  if (!client) notFound();
  const types = await fetchNoteTypes(user.idclinic);

  return (
    <main className="space-y-6 px-2 py-4 md:px-4">
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
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-blue-100 bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-900 p-6 shadow-[0_25px_80px_rgba(37,99,235,0.16)]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">Prontuário</p>
        <h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">Nova ficha clínica</h1>
        <p className="mt-2 text-sm text-blue-100 sm:text-base">Paciente: {client.name}</p>
      </div>
      <Form client={client} user={user} types={types} />
    </main>
  );
}
