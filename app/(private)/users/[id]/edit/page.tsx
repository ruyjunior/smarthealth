import Form from '../../components/edit-form';
import Breadcrumbs from '@/app/components/ui/breadcrumbs';
import {fetchUserById } from '@/app/query/users/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Editar Perfil',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = params.id;
    const [user] = await Promise.all([
        fetchUserById(id),
      ]);
      if (!user) {
    notFound();
    }

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                { label: 'Perfil', href: `/users` },
                {
                    label: 'Editar Perfil',
                    href: `/perfil/${id}/edit`,
                    active: true,
                },
                ]}
            />
        <Form user={user} />
        </main>
  );
}