import { auth } from '@/app/lib/auth';

export default async function UserCard() {
  const session = await auth();
  if (!session) return <p>Nenhuma sessão</p>;
  if (!session.user) return <p>Nenhum usuário logado.</p>;

  return (
    <div>
      <div className="flex flex-col md:flex-row items-center justify-center leading-none text-white m-5 mb-10">
        <span className="font-semibold">{session.user.name}</span>
        <span className="text-xs md:ml-2 text-blue-100">{session.user.role}</span>
      </div>
    </div>
  );
}