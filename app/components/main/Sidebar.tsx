import Nav from '../ui/navlist';
import UserCard from '../ui/userCard';
import Logout from '../ui/logout';
import ClinicCard from '../ui/clinicCard';
import { auth } from '@/app/lib/auth';
import { getSessionUser } from '@/app/lib/session';

export default async function Sidebar() {
  const session = await auth();

  if (!session?.user) {
    return (
      <aside className="sticky top-0 flex h-screen w-20 shrink-0 flex-col overflow-y-auto bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 p-3 text-white shadow-xl shadow-slate-900/15 md:w-64 md:p-4">
        <p className="text-sm">Usuário não autenticado</p>
      </aside>
    );
  }

  const userId = session.user.id;
  if (!userId) {
    return (
      <aside className="sticky top-0 flex h-screen w-20 shrink-0 flex-col overflow-y-auto bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 p-3 text-white shadow-xl shadow-slate-900/15 md:w-64 md:p-4">
        <p className="text-sm">Sessão inválida</p>
      </aside>
    );
  }

  const user = await getSessionUser();

  if (!user) {
    return (
      <aside className="sticky top-0 flex h-screen w-20 shrink-0 flex-col overflow-y-auto bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 p-3 text-white shadow-xl shadow-slate-900/15 md:w-64 md:p-4">
        <p className="text-sm">Sessão inválida</p>
      </aside>
    );
  }

  return (
    <aside className="sticky top-0 flex h-screen w-20 shrink-0 flex-col overflow-y-auto bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 p-3 text-white shadow-xl shadow-slate-900/15 md:w-64 md:p-4">
      <ClinicCard />
      <Nav user={user} />
      <UserCard />
      <Logout />
    </aside>
  );
}
