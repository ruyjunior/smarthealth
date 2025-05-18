import Nav from "../ui/navlist";
import UserCard from "../ui/userCard";
import Logout from "../ui/logout";
import ClinicCard from "../ui/clinicCard";


export default async function Sidebar() {

  return (
    <aside className="h-screen w-20 md:w-64 fixed flex flex-col bg-blue-400 text-white shadow-md p-4 transition-all duration-300">
      <ClinicCard />
      <Nav />
      <UserCard />
      <Logout />
    </aside>
  );
}