import Form from '../../components/edit-form';
import Breadcrumbs from '@/app/components/ui/breadcrumbs';
import {fetchTypeById } from '@/app/query/types/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Editar Especialidade',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = params.id;
    const [type] = await Promise.all([
        fetchTypeById(id),
      ]);
      if (!type) {
    notFound();
    }

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                { label: 'Especialidades', href: `/manager/types` },
                {
                    label: 'Editar Especialidade',
                    href: `/manager/types/${id}/edit`,
                    active: true,
                },
                ]}
            />
        <Form type={type} />
        </main>
  );
}