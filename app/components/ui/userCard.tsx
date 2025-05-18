import { auth } from '@/app/lib/auth';

export default async function UserCard() {
  const session = await auth();
  if (!session) return <p>Nenhuma sessão</p>;
  if (!session.user) return <p>Nenhum usuário logado.</p>;

  return (
    <div>
      <div className='flex flex-row items-center justify-center leading-none text-white m-5'>
        <p> {session.user.name} | {session.user.role}</p>
      </div>
    </div>
  )
}
