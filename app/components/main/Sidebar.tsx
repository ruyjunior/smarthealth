import Nav from "../ui/navlist";
import UserCard from "../ui/userCard";
import Logout from "../ui/logout";
import ClinicCard from "../ui/clinicCard";
import { auth } from "@/app/lib/auth";
import { fetchUserById } from "@/app/query/users/data";

export default async function Sidebar() {
  const session = await auth();

  if (!session?.user) {
    return (
      <aside className=" w-20 md:w-64 flex flex-col bg-blue-500 text-white shadow-md p-4">
        <p className="text-sm">Usuário não autenticado</p>
      </aside>
    );
  }

  const user = await fetchUserById(session.user.id);

  return (
    <aside className="w-20 md:w-64 flex flex-col bg-blue-300 text-white shadow-md p-4 flex-shrink-0">
      <ClinicCard />
      <Nav user={user} />
      <UserCard />
      <Logout />
    </aside>
  );
}
