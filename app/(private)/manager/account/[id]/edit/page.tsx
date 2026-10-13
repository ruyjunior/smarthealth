import Form from '../../components/edit-form';
import { getCurrentClinicId } from '@/app/lib/session';
import Breadcrumbs from '@/app/components/ui/breadcrumbs';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { fetchCreditById } from '@/app/domains/credit/queries';
import { fetchUsers } from '@/app/domains/users/queries';

export const metadata: Metadata = {
  title: 'Editar Crédito',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const idclinic = await getCurrentClinicId();
  const params = await props.params;
  const id = params.id;
  const credit = await fetchCreditById(idclinic, id);
  const users = await fetchUsers(idclinic);
  if (!credit) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Gerência', href: `/manager` },
          { label: 'Créditos', href: `/manager/account` },
          {
            label: 'Editar Crédito',
            href: `/manager/account/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form credit={credit} users={users} />
    </main>
  );
}
