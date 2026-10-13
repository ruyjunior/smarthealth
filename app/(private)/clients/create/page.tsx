import Form from '../components/create-form';
import { requireSessionUser } from '@/app/lib/session';
import Breadcrumbs from '@/app/components/ui/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Novo Paciente',
};

export default async function Page() {
  await requireSessionUser();

  return (
    <main className="space-y-6 px-2 py-4 md:px-4">
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Pacientes', href: '/clients' },
          {
            label: 'Novo Paciente',
            href: '/clients/create',
            active: true,
          },
        ]}
      />
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-blue-100 bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-900 p-6 shadow-[0_25px_80px_rgba(37,99,235,0.16)]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">Pacientes</p>
        <h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">
          Cadastrar novo paciente
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-blue-100 sm:text-base">
          Preencha os dados abaixo para adicionar o paciente à clínica.
        </p>
      </div>
      <Form />
    </main>
  );
}
