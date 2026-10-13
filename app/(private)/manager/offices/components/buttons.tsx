'use client';

import { CreateAction, DeleteAction, EditAction } from '@/app/components/ui/action-icon';
import { deleteOffice } from '@/app/domains/offices/actions';

export function CreateOffice() {
  return <CreateAction href="/manager/offices/create" label="Novo consultório" />;
}

export function UpdateOffice({ id }: { id: string }) {
  return <EditAction href={`/manager/offices/${id}/edit`} label="Editar consultório" />;
}

export function DeleteOffice({ id }: { id: string }) {
  return (
    <DeleteAction action={deleteOffice.bind(null, id)} label="Segure para excluir consultório" />
  );
}
