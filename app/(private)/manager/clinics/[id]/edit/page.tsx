import Form from '../../components/edit-form';
import Breadcrumbs from '@/app/components/ui/breadcrumbs';
import {fetchClinicById } from '@/app/query/clinics/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Editar Consultório',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = params.id;
    const [clinic] = await Promise.all([
        fetchClinicById(id),
      ]);
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
                    href: `/manager/clinic/${id}/edit`,
                    active: true,
                },
                ]}
            />
        <Form clinic={clinic} />
        </main>
  );
}