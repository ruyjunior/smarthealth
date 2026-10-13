import Form from '../../components/edit-form';
import { getCurrentClinicId } from '@/app/lib/session';
import Breadcrumbs from '@/app/components/ui/breadcrumbs';
import { fetchClientById } from '@/app/domains/clients/queries';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Editar Paciente',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const idclinic = await getCurrentClinicId();
  const params = await props.params;
  const id = params.id;
  const [client] = await Promise.all([fetchClientById(idclinic, id)]);
  if (!client) {
    notFound();
  }

  return (
    <main className="space-y-6 px-2 py-4 md:px-4">
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Pacientes', href: `/clients` },
          {
            label: 'Editar Paciente',
            href: `/clients/${id}/edit`,
            active: true,
          },
        ]}
      />
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-blue-100 bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-900 p-6 shadow-[0_25px_80px_rgba(37,99,235,0.16)]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">Pacientes</p>
        <h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">
          Editar dados do paciente
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-blue-100 sm:text-base">
          Atualize os dados cadastrais e salve as alterações.
        </p>
      </div>
      <Form client={client} />
    </main>
  );
}
