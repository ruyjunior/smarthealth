import { EditAction } from '@/app/components/ui/action-icon';

export function Update({ id }: { id: string }) {
  return <EditAction href={`/manager/account/${id}/edit`} label="Editar dados da conta" />;
}
