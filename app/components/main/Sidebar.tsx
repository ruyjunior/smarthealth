import Nav from "../ui/navlist";
import UserCard from "../ui/userCard";
import Logout from "../ui/logout";
import ClinicCard from "../ui/clinicCard";
import { auth } from '@/app/lib/auth';
import { fetchUserById } from '@/app/query/users/data';


export default async function Sidebar() {
  const session = await auth();
  if (!session) return <p>Nenhuma sessão</p>;
  if (!session.user) return <p>Nenhum usuário logado.</p>;
  const user = await fetchUserById(session.user.id);

  return (
    <aside className="h-screen w-20 md:w-64 fixed flex flex-col bg-blue-400 text-white shadow-md p-4 transition-all duration-300">
      <ClinicCard />
      <Nav user={user}/>
      <UserCard />
      <Logout />
    </aside>
  );
}