'use client';

import { CreateAction, DeleteAction, EditAction } from '@/app/components/ui/action-icon';
import { deletePayment } from '@/app/domains/payments/actions';

export function CreatePayment() {
  return <CreateAction href="/manager/payments/create" label="Novo pagamento" />;
}

export function UpdatePayment({ id }: { id: string }) {
  return <EditAction href={`/manager/payments/${id}/edit`} label="Editar pagamento" />;
}

export function DeletePayment({ id }: { id: string }) {
  return (
    <DeleteAction action={deletePayment.bind(null, id)} label="Segure para excluir pagamento" />
  );
}
