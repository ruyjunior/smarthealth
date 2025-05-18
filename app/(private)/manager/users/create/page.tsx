import Form from '../components/create-form';
import Breadcrumbs from '@/app/components/ui/breadcrumbs';
import { Metadata } from 'next';
import { auth } from '@/app/lib/auth';
import { fetchUserById } from '@/app/query/users/data';


export const metadata: Metadata = {
  title: 'Novo Perfil',
};

export default async function Page() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error('User session is not available.');
  }
  const user = await fetchUserById(session.user.id);

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
      <Form id={user.idclinic} />
    </main>
  );
}