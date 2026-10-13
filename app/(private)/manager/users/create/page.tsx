import Form from '../components/create-form';
import { requireSessionUser } from '@/app/lib/session';
import Breadcrumbs from '@/app/components/ui/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Novo Perfil',
};

export default async function Page() {
  await requireSessionUser();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Usuários', href: '/manager/users' },
          {
            label: 'Novo Usuário',
            href: '/manager/users/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}
