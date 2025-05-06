import Form from '../components/create-form';
import Breadcrumbs from '@/app/components/ui/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Novo Perfil',
};

export default async function Page() {
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Perfil', href: '/users' },
          {
            label: 'Novo Perfil',
            href: '/users/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}