import { Metadata } from 'next';
import BudgetTableClient from './components/BudgetTableClient';
import { fetchTypes } from '@/app/domains/types/queries';
import { fetchClinicById } from '@/app/domains/clinics/queries';
import { getCurrentClinicId, requireSessionUser } from '@/app/lib/session';
import ListPageShell from '@/app/components/ui/list-page-shell';

export const metadata: Metadata = {
  title: 'Orçamento',
};

export default async function Page() {
  const user = await requireSessionUser();
  const types = await fetchTypes(user.idclinic);
  const clinicId = await getCurrentClinicId();
  const clinic = await fetchClinicById(clinicId);

  return (
    <ListPageShell
      eyebrow="Financeiro"
      title="Orçamento"
      subtitle="Monte um orçamento com os itens da clínica e gere o PDF para o paciente."
    >
      <div className="mx-auto mt-6 max-w-7xl">
        <BudgetTableClient types={types} user={user} clinic={clinic} />
      </div>
    </ListPageShell>
  );
}
