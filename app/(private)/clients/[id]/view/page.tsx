import NotesTable from '@/app/(private)/notes/components/table';
import { getCurrentClinicId } from '@/app/lib/session';
import ClientsTable from '@/app/(private)/clients/components/table';
import { CreateNote } from '@/app/(private)/notes/components/buttons';
import Breadcrumbs from '@/app/components/ui/breadcrumbs';
import { fetchClientById } from '@/app/domains/clients/queries';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dados do paciente',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const idclinic = await getCurrentClinicId();
  const params = await props.params;
  const id = params.id;
  const client = await fetchClientById(idclinic, id);
  if (!client) {
    notFound();
  }

  return (
    <main className="space-y-6 px-2 py-4 md:px-4">
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Pacientes', href: '/clients' },
          {
            label: 'Paciente: ' + client.name,
            href: `/clients/${id}/view`,
            active: true,
          },
        ]}
      />
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-blue-100 bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-900 p-6 shadow-[0_25px_80px_rgba(37,99,235,0.16)]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">Prontuário</p>
        <h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">
          {client.pronoun} {client.name}
        </h1>
        <p className="mt-2 text-sm text-blue-100 sm:text-base">
          Dados cadastrais e fichas clínicas deste paciente.
        </p>
      </div>
      <ClientsTable query={id} currentPage={null} />
      <div className="flex flex-col gap-4 rounded-[1.5rem] border border-blue-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Fichas clínicas</h2>
          <p className="mt-1 text-sm text-slate-500">Registros e acompanhamentos do paciente.</p>
        </div>
        <CreateNote id={id} />
      </div>
      <NotesTable query={id} currentPage={null} />
    </main>
  );
}
