import Form from '../../components/pdf-form';
import Breadcrumbs from '@/app/components/ui/breadcrumbs';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { fetchNoteById } from '@/app/query/notes/data';
import { fetchClinicById } from '@/app/query/clinics/data';
import { fetchUserById } from '@/app/query/users/data';
import { fetchNoteTypeById } from '@/app/query/notetypes/data';
import { fetchClientById } from '@/app/query/clients/data';

export const metadata: Metadata = {
  title: 'PDF Fichas',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const note = await fetchNoteById(id);
  const user = await fetchUserById(note.iduser);
  const client = await fetchClientById(note.idclient);
  const type = await fetchNoteTypeById(note.idnotetype);
  const clinic = await fetchClinicById(user.idclinic);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Client', href: `/clients/${note.idclient}/view` },
          {
            label: 'PDF',
            href: `/notes/${id}/pdf`,
            active: true,
          },
        ]}
      />
      <Form
        note={note}
        type={type}
        user={user}
        client={client}
        clinic={clinic}
      />
    </main>
  );
}