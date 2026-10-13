'use client';

import {
  CreateAction,
  DeleteAction,
  EditAction,
  PrintAction,
} from '@/app/components/ui/action-icon';
import { deleteNote } from '@/app/domains/notes/actions';

export function CreateNote({ id }: { id: string }) {
  return <CreateAction href={`/notes/${id}/create`} label="Nova ficha" />;
}

export function UpdateNote({ id }: { id: string }) {
  return <EditAction href={`/notes/${id}/edit`} label="Editar ficha" />;
}

export function DeleteNote({ id }: { id: string }) {
  return <DeleteAction action={deleteNote.bind(null, id)} label="Segure para excluir ficha" />;
}

export function PdfNotes({ id }: { id: string }) {
  return <PrintAction href={`/notes/${id}/pdf`} label="Imprimir ficha" />;
}
