'use client';

import { CreateAction, DeleteAction, EditAction } from '@/app/components/ui/action-icon';
import { deleteNoteType } from '@/app/domains/notetypes/actions';

export function CreateNoteType() {
  return <CreateAction href="/manager/notetypes/create" label="Nova ficha" />;
}

export function UpdateNoteType({ id }: { id: string }) {
  return <EditAction href={`/manager/notetypes/${id}/edit`} label="Editar ficha" />;
}

export function DeleteNoteType({ id }: { id: string }) {
  return <DeleteAction action={deleteNoteType.bind(null, id)} label="Segure para excluir ficha" />;
}
