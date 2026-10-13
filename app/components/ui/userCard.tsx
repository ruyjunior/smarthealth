import { auth } from '@/app/lib/auth';
import { getSessionUser } from '@/app/lib/session';
import { fetchCredits } from '@/app/domains/credit/queries';
import Image from 'next/image';
import logo from '@/public/images/logo.png';
import Link from 'next/link';

export default async function UserCard() {
  const session = await auth();
  if (!session) return <p>Nenhuma sessão</p>;
  if (!session.user) return <p>Nenhum usuário logado.</p>;

  const userId = session.user.id;
  if (!userId) return <p>Sessão inválida.</p>;

  const user = await getSessionUser();
  if (!user) return <p>Sessão inválida.</p>;
  const userEmail = session.user.email ?? '';
  const credit = (await fetchCredits(user.idclinic)).find((credit) => credit.email === userEmail);
  const expires = credit ? new Date(credit.expires) : new Date();

  return (
    <Link href="/user" className="block group">
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-4 text-white">
        <span className="hidden max-w-full truncate px-2 text-base font-semibold md:block">
          {session.user.name}
        </span>
        <Image
          src={user.avatarurl ? user.avatarurl : logo.src}
          alt="Avatar"
          width={200}
          height={200}
          className="h-10 w-10 md:h-20 md:w-20 rounded-full"
        />
        <span className="hidden text-xs text-blue-200 md:block">{session.user.role}</span>
        <span className="hidden text-center text-xs text-slate-400 md:block">
          Ativo até {expires.toLocaleDateString('pt-BR')}
        </span>
      </div>
    </Link>
  );
}
