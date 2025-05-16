import Form from '../../components/edit-form';
import Breadcrumbs from '@/app/components/ui/breadcrumbs';
import {fetchOfficeById } from '@/app/query/offices/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Editar Consultório',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = params.id;
    const [office] = await Promise.all([
        fetchOfficeById(id),
      ]);
      if (!office) {
    notFound();
    }

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                { label: 'Consultórios', href: `/offices` },
                {
                    label: 'Editar Consultório',
                    href: `/manager/manager/office/${id}/edit`,
                    active: true,
                },
                ]}
            />
        <Form office={office} />
        </main>
  );
}