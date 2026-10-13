import Form from '../components/create-form';
import { requireSessionUser } from '@/app/lib/session';
import Breadcrumbs from '@/app/components/ui/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nova Ficha',
};

export default async function Page() {
  await requireSessionUser();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Fichas', href: '/manager/notetypes' },
          {
            label: 'Nova Ficha',
            href: '/manager/notetypes/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}
