import Form from '../../components/edit-form';
import Breadcrumbs from '@/app/components/ui/breadcrumbs';
import { fetchClinicById } from '@/app/domains/clinics/queries';
import { getCurrentClinicId } from '@/app/lib/session';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Editar Consultório',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const idclinic = await getCurrentClinicId();
  const params = await props.params;
  const id = params.id;

  // a manager can only reach their own clinic, whatever the URL says
  if (id !== idclinic) {
    notFound();
  }

  const clinic = await fetchClinicById(idclinic);
  if (!clinic) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Gerência', href: `/manager` },
          {
            label: 'Editar Clínica',
            href: `/manager/clinics/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form clinic={clinic} />
    </main>
  );
}
