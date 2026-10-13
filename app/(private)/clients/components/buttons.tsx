'use client';

import {
  CreateAction,
  DeleteAction,
  EditAction,
  ViewAction,
  WhatsappAction,
} from '@/app/components/ui/action-icon';
import { deleteClient } from '@/app/domains/clients/actions';

export function CreateClient() {
  return <CreateAction href="/clients/create" label="Novo paciente" />;
}

export function UpdateClient({ id }: { id: string }) {
  return <EditAction href={`/clients/${id}/edit`} label="Editar paciente" />;
}

export function ViewClient({ id }: { id: string }) {
  return <ViewAction href={`/clients/${id}/view`} label="Ver paciente" />;
}

export function DeleteClient({ id }: { id: string }) {
  return <DeleteAction action={deleteClient.bind(null, id)} label="Segure para excluir paciente" />;
}

export function CallWhatsapp({ phone }: { phone: string }) {
  return <WhatsappAction phone={phone} />;
}
