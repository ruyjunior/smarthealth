import Form from '../../components/edit-form';
import Breadcrumbs from '@/app/components/ui/breadcrumbs';
import {fetchNoteTypeById } from '@/app/query/notetypes/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Editar Avaliação',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = params.id;
    const [type] = await Promise.all([
        fetchNoteTypeById(id),
      ]);
      if (!type) {
    notFound();
    }

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                { label: 'Fichas', href: `/manager/notetypes` },
                {
                    label: 'Editar Ficha',
                    href: `/manager/notetypes/${id}/edit`,
                    active: true,
                },
                ]}
            />
        <Form notetype={type} />
        </main>
  );
}