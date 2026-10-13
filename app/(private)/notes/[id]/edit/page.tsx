import Form from '../../components/edit-form';
import { requireSessionUser } from '@/app/lib/session';
import Breadcrumbs from '@/app/components/ui/breadcrumbs';
import { fetchNoteById } from '@/app/domains/notes/queries';
import { fetchNoteTypes } from '@/app/domains/notetypes/queries';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { fetchClientById } from '@/app/domains/clients/queries';

export const metadata: Metadata = {
  title: 'Editar ficha clínica',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const user = await requireSessionUser();
  const id = params.id;

  const note = await fetchNoteById(user.idclinic, id);
  if (!note) notFound();
  const client = await fetchClientById(user.idclinic, note.idclient);
  if (!client) notFound();
  const types = await fetchNoteTypes(user.idclinic);

  return (
    <main className="space-y-6 px-2 py-4 md:px-4">
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Paciente', href: `/clients` },
          { label: `Nota: ${client?.name}`, href: `/clients/${client.id}/view` },
          {
            label: 'Editar Ficha',
            href: `/notes/${id}/edit`,
            active: true,
          },
        ]}
      />
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-blue-100 bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-900 p-6 shadow-[0_25px_80px_rgba(37,99,235,0.16)]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">Prontuário</p>
        <h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">
          Editar ficha clínica
        </h1>
        <p className="mt-2 text-sm text-blue-100 sm:text-base">Paciente: {client.name}</p>
      </div>
      <Form note={note} client={client} user={user} types={types} />
    </main>
  );
}
