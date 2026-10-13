import Form from '../../components/edit-form';
import { getCurrentClinicId } from '@/app/lib/session';
import Breadcrumbs from '@/app/components/ui/breadcrumbs';
import { fetchPaymentById } from '@/app/domains/payments/queries';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Editar Pagamento',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const idclinic = await getCurrentClinicId();
  const params = await props.params;
  const id = params.id;
  const [payment] = await Promise.all([fetchPaymentById(idclinic, id)]);
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
