'use client';

import { CreateAction, DeleteAction, EditAction } from '@/app/components/ui/action-icon';
import { deleteService } from '@/app/domains/services/actions';

export function CreateService() {
  return <CreateAction href="/services/create" label="Novo agendamento" />;
}

export function UpdateService({ id }: { id: string }) {
  return <EditAction href={`/services/${id}/edit`} label="Editar agendamento" />;
}

export function DeleteService({ id }: { id: string }) {
  return (
    <DeleteAction action={deleteService.bind(null, id)} label="Segure para excluir agendamento" />
  );
}
