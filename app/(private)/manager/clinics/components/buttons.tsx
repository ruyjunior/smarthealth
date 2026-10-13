import { TrashIcon } from '@heroicons/react/24/outline';
import { EditAction } from '@/app/components/ui/action-icon';
import { deleteClinic } from '@/app/domains/clinics/actions';

export function Updateclinic({ id }: { id: string }) {
  return <EditAction href={`/manager/clinics/${id}/edit`} label="Editar clínica" />;
}

export function Deleteclinic({ id }: { id: string }) {
  const deleteclinicWithId = deleteClinic.bind(null, id);
  return (
    <form action={deleteclinicWithId}>
      <button
        type="submit"
        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 transition-all duration-200 hover:border-red-300 hover:bg-red-100"
        aria-label="Excluir clínica"
        title="Excluir clínica"
      >
        <span className="sr-only">Excluir clínica</span>
        <TrashIcon className="h-4 w-4" />
      </button>
    </form>
  );
}
