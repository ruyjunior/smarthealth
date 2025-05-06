import Form from '../components/create-form';
import Breadcrumbs from '@/app/components/ui/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Novo Paciente',
};

export default async function Page() {
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Pacientes', href: '/clients' },
          {
            label: 'Novo Paciente',
            href: '/clients/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}