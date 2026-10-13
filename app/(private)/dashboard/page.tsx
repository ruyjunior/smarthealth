import { Metadata } from 'next';
import { requireSessionUser } from '@/app/lib/session';
import {
  fetchTodayServices,
  fetchCurrentWeekServices,
  fetchCurrentMonthServices,
} from '@/app/domains/services/queries';
import { fetchTypes } from '@/app/domains/types/queries';
import { fetchUsers } from '@/app/domains/users/queries';
import { fetchClients } from '@/app/domains/clients/queries';
import { fetchOffices } from '@/app/domains/offices/queries';
import ServiceSwitcher from './components/ServiceSwitcher';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default async function Page() {
  const user = await requireSessionUser();

  const todayServices = await fetchTodayServices(user.idclinic);
  const weekServices = await fetchCurrentWeekServices(user.idclinic);
  const monthServices = await fetchCurrentMonthServices(user.idclinic);
  const users = await fetchUsers(user.idclinic);
  const clients = await fetchClients(user.idclinic);
  const types = await fetchTypes(user.idclinic);
  const offices = await fetchOffices(user.idclinic);

  return (
    <ServiceSwitcher
      user={user}
      todayServices={todayServices}
      weekServices={weekServices}
      monthServices={monthServices}
      users={users}
      clients={clients}
      types={types}
      offices={offices}
    />
  );
}
