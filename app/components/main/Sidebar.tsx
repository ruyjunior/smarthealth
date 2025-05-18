import Nav from "./nav";
import UserCard from "../ui/userCard";
import Logo from "../ui/logoApp";
import Logout from "./logout";
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