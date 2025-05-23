import { Metadata } from "next";
import Resume from "./components/Resume";
import Charts from "./components/ChartsWeek";
import { fetchTodayServices } from '@/app/query/services/data';
import { fetchTypes } from "@/app/query/types/data";
import { fetchUserById, fetchUsers } from "@/app/query/users/data";
import { fetchClients } from "@/app/query/clients/data";
import { fetchOffices } from "@/app/query/offices/data";
import { auth } from '@/app/lib/auth';
import ServiceSwitcher from "./components/ServiceSwitcher";

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default async function Page() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error('User session is not available.');
  }
  const user = await fetchUserById(session.user.id);

  const todayServices = await fetchTodayServices();
  const users = await fetchUsers();
  const clients = await fetchClients();
  const types = await fetchTypes();
  const offices = await fetchOffices();

  return (
    <div className="w-full">
      <div className="w-full">
        <ServiceSwitcher
          user={user}
          todayServices={todayServices}
          users={users}
          clients={clients}
          types={types}
          offices={offices}
        />
        <Resume />
        <Charts />
      </div>
    </div>
  );
}