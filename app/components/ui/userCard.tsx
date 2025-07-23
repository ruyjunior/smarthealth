import { auth } from '@/app/lib/auth';
import { fetchUserById } from '@/app/query/users/data';
import Image from 'next/image';
import logo from '@/public/images/logo.png';
import Link from "next/link";

export default async function UserCard() {
  const session = await auth();
  if (!session) return <p>Nenhuma sessão</p>;
  if (!session.user) return <p>Nenhum usuário logado.</p>;
  const user = await fetchUserById(session.user.id);

  return (
    <Link href="/user" className="block group">
      <div className="flex flex-col items-center gap-2 text-white py-4">
        <span className="font-semibold text-base">{session.user.name}</span>
        <Image
          src={user.avatarurl ? user.avatarurl : logo.src}
          alt="Avatar"
          width={200}
          height={200}
          className="h-10 w-10 md:h-20 md:w-20 rounded-full"
        />
        <span className="text-xs text-blue-100">{session.user.role}</span>
      </div>
    </Link>);
}