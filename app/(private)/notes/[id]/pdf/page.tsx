import Form from '../../components/pdf-form';
import { getCurrentClinicId } from '@/app/lib/session';
import Breadcrumbs from '@/app/components/ui/breadcrumbs';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { fetchNoteById } from '@/app/domains/notes/queries';
import { fetchClinicById } from '@/app/domains/clinics/queries';
import { fetchUserById } from '@/app/domains/users/queries';
import { fetchNoteTypeById } from '@/app/domains/notetypes/queries';
import { fetchClientById } from '@/app/domains/clients/queries';

export const metadata: Metadata = {
  title: 'PDF Fichas',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const idclinic = await getCurrentClinicId();
  const params = await props.params;
  const id = params.id;
  const note = await fetchNoteById(idclinic, id);
  if (!note) notFound();
  const user = await fetchUserById(idclinic, note.iduser);
  if (!user) notFound();
  const client = await fetchClientById(idclinic, note.idclient);
  if (!client) notFound();
  const type = await fetchNoteTypeById(idclinic, note.idnotetype);
  if (!type) notFound();
  const clinic = await fetchClinicById(idclinic);
  if (!clinic) notFound();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Paciente', href: `/clients/${note.idclient}/view` },
          {
            label: 'PDF',
            href: `/notes/${id}/pdf`,
            active: true,
          },
        ]}
      />
      <Form note={note} type={type} user={user} client={client} clinic={clinic} />
    </main>
  );
}
