import Form from './components/edit-form';
import { fetchUserById } from '@/app/query/users/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { lusitana } from '@/app/components/ui/fonts';
import { auth } from '@/app/lib/auth';

export const metadata: Metadata = {
  title: 'Editar Perfil',
};

export default async function Page() {

  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error('User session is not available.');
  }
  const user = await fetchUserById(session.user.id);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Perfil</h1>
      </div>
      <Form user={user} />
    </div>
  );
}