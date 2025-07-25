import Form from '../../components/edit-form';
import Breadcrumbs from '@/app/components/ui/breadcrumbs';
import { fetchPaymentById } from '@/app/query/payments/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { fetchClients } from '@/app/query/clients/data';
import { fetchOffices } from '@/app/query/offices/data';
import { fetchTypes } from '@/app/query/types/data';
import { fetchUsers } from '@/app/query/users/data';


export const metadata: Metadata = {
  title: 'Editar Pagamento',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const [payment] = await Promise.all([
    fetchPaymentById    (id),
  ]);
  if (!payment) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Pagamentos', href: `/manager/payments` },
          {
            label: 'Editar Pagamento',
            href: `/manager/payments/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form payment={payment} />
    </main>
  );
}