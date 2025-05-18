import Form from '../components/create-form';
import Breadcrumbs from '@/app/components/ui/breadcrumbs';
import { Metadata } from 'next';
import { auth } from '@/app/lib/auth';
import { fetchUserById } from '@/app/query/users/data';


export const metadata: Metadata = {
  title: 'Novo Consultório',
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
          { label: 'Consultórios', href: '/manager/offices' },
          {
            label: 'Novo Consultório',
            href: '/manager/offices/create',
            active: true,
          },
        ]}
      />
      <Form id={user.idclinic} />
    </main>
  );
}