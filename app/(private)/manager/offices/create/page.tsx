import Form from '../components/create-form';
import { requireSessionUser } from '@/app/lib/session';
import Breadcrumbs from '@/app/components/ui/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Novo Consultório',
};

export default async function Page() {
  await requireSessionUser();

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
      <Form />
    </main>
  );
}
