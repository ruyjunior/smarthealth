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
          { label: 'Especialidades', href: '/manager/types' },
          {
            label: 'Nova Especialidade',
            href: '/manager/types/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}