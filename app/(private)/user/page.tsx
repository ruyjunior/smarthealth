import Form from './components/edit-form';
import { requireSessionUser } from '@/app/lib/session';
import { Metadata } from 'next';
import ListPageShell from '@/app/components/ui/list-page-shell';

export const metadata: Metadata = {
  title: 'Editar Perfil',
};

export default async function Page() {
  const user = await requireSessionUser();

  return (
    <ListPageShell
      eyebrow="Conta"
      title="Meu perfil"
      subtitle="Atualize seus dados de acesso e informações pessoais."
    >
      <div className="mx-auto mt-6 w-full max-w-5xl">
        <Form user={user} />
      </div>
    </ListPageShell>
  );
}
