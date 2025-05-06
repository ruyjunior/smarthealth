import Form from '../components/create-form';
import Breadcrumbs from '@/app/components/ui/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nova Especialidade',
};

export default async function Page() {
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Especialidades', href: '/types' },
          {
            label: 'Nova Especialidade',
            href: '/types/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}