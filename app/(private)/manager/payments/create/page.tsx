import Form from '../components/create-form';
import { requireSessionUser } from '@/app/lib/session';
import Breadcrumbs from '@/app/components/ui/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Novo Agendamento',
};

export default async function Page() {
  await requireSessionUser();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Pagamentos', href: '/manager/payments' },
          {
            label: 'Novo Pagamento',
            href: '/manager/payments/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}
