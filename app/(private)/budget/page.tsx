import { Metadata } from 'next';
import { lusitana } from '@/app/components/ui/fonts';
import BudgetTableClient from './components/BudgetTableClient';
import { fetchTypes } from '@/app/query/types/data';
import { auth } from '@/app/lib/auth';
import { fetchUserById } from '@/app/query/users/data';
import { CurrentClinicId } from '@/app/lib/utils';
import { fetchClinicById } from '@/app/query/clinics/data';
import { DocPDF } from './components/docPDF';

export const metadata: Metadata = {
  title: 'Orçamento',
};

export default async function Page() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error('User session is not available.');
  }
  const user = await fetchUserById(session.user.id);
  const types = await fetchTypes();
  const clinicId = await CurrentClinicId();
  const clinic = await fetchClinicById(clinicId);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Orçamento</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-0">
        <BudgetTableClient types={types} user={user} clinic={clinic} />
      </div>
    </div>
  );
}

function usePDF(arg0: { document: Document; }): [any, any] {
  throw new Error('Function not implemented.');
}
