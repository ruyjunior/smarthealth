import Form from '../components/create-form';
import Breadcrumbs from '@/app/components/ui/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Novo Consultório',
};

export default async function Page() {
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Consultórios', href: '/manager/clinics' },
          {
            label: 'Novo Consultório',
            href: '/manager/clinics/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}