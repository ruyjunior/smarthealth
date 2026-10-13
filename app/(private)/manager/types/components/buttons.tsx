'use client';

import { CreateAction, DeleteAction, EditAction } from '@/app/components/ui/action-icon';
import { deleteType } from '@/app/domains/types/actions';

export function CreateType() {
  return <CreateAction href="/manager/types/create" label="Nova especialidade" />;
}

export function UpdateType({ id }: { id: string }) {
  return <EditAction href={`/manager/types/${id}/edit`} label="Editar especialidade" />;
}

export function DeleteType({ id }: { id: string }) {
  return (
    <DeleteAction action={deleteType.bind(null, id)} label="Segure para excluir especialidade" />
  );
}
