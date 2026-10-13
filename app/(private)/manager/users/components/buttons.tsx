'use client';

import { CreateAction, DeleteAction, EditAction } from '@/app/components/ui/action-icon';
import { deleteUser } from '@/app/domains/users/actions';

export function CreateUser() {
  return <CreateAction href="/manager/users/create" label="Novo usuário" />;
}

export function UpdateUser({ id }: { id: string }) {
  return <EditAction href={`/manager/users/${id}/edit`} label="Editar usuário" />;
}

export function DeleteUser({ id }: { id: string }) {
  return <DeleteAction action={deleteUser.bind(null, id)} label="Segure para excluir usuário" />;
}
