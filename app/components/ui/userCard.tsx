import { auth } from '@/app/lib/auth';
import { fetchUserById } from '@/app/query/users/data';
import Image from 'next/image';

export default async function UserCard() {
  const session = await auth();
  if (!session) return <p>Nenhuma sessão</p>;
  if (!session.user) return <p>Nenhum usuário logado.</p>;
  const user = await fetchUserById(session.user.id);

  return (
    <div>
      <div className="flex flex-col items-center gap-2 text-white py-4">
        <span className="font-semibold text-base">{session.user.name}</span>
        <Image
          src={user.avatarurl}
          alt="Avatar"
          width={200}
          height={200}
          className="h-10 w-10 md:h-20 md:w-20 rounded-full"
        />
        <span className="text-xs text-blue-100">{session.user.role}</span>
      </div>
    </div>
  );
}