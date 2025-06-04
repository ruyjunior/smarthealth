import { sql } from '@vercel/postgres';
import { Service } from './definitions';
import { CurrentClinicId, formatTime } from '@/app/lib/utils';
import { auth } from '@/app/lib/auth';
import { fetchUserById } from '@/app/query/users/data';
import { error } from 'console';


export async function fetchServices() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error('User session is not available.');
  }
  const user = await fetchUserById(session.user.id);

  try {
    const data = await sql<Service>`
    SELECT 
      id, iduser, idoffice, idclient, idtype, status, date, starttime, endtime,
      (endtime - starttime)::TIME AS totaltime
    FROM smarthealth.services
    WHERE services.idclinic = ${user.idclinic}
    ORDER BY date, starttime ASC
    `;
    const services = data.rows;
    return services;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all services.');
  }
}

export async function fetchFilteredServices(
  query: string | undefined | null,
  currentPnumber: number | undefined | null) {
  const offset = currentPnumber ? (currentPnumber - 1) * ITEMS_PER_PAGE : 0;

  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error('User session is not available.');
  }
  const user = await fetchUserById(session.user.id);

  try {
    const data = await sql<Service>`
    SELECT 
      services.id, services.iduser, services.idoffice, services.idclient, services.idtype, 
      services.status, services.date, services.starttime, services.endtime, services.idclinic
    FROM smarthealth.services
    LEFT JOIN smarthealth.clients ON services.idclient = clients.id
    WHERE 
      (clients.name::text ILIKE ${`%${query ?? ''}%`} OR
      clients.cpf::text ILIKE ${`%${query ?? ''}%`} OR
      services.id::text ILIKE ${`%${query ?? ''}%`}) 
      AND
      services.idclinic = ${user.idclinic}
    ORDER BY services.date DESC, services.starttime ASC
    LIMIT ${ITEMS_PER_PAGE}
    OFFSET ${offset}
  `;
    const services = data.rows;
    return services;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to search services.');
  }
}
const ITEMS_PER_PAGE = 6;

export async function fetchServicesPages(query: string) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error('User session is not available.');
  }
  const user = await fetchUserById(session.user.id);

  try {
    const count = await sql`
    SELECT COUNT(*) 
    FROM smarthealth.services
    WHERE services.idclinic = ${user.idclinic}`;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number.');
  }
}

export async function fetchServiceById(id: string) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error('User session is not available.');
  }
  const user = await fetchUserById(session.user.id);

  try {
    const data = await sql<Service>`
      SELECT 
        id, iduser, idoffice, idclient, idtype, status, date, starttime, endtime 
      FROM smarthealth.services
      WHERE services.id = ${id} AND services.idclinic = ${user.idclinic}
    `;

    const service = data.rows.map((service) => ({
      ...service,
      starttime: formatTime(service.starttime),
      endtime: formatTime(service.endtime),
    }));
    return service[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch service.');
  }
}

export async function fetchServicesByUser(id: string) {

  try {
    const data = await sql<Service>`
      SELECT 
        id, idoffice, idclient, idtype, status, date, starttime, endtime 
      FROM smarthealth.services
      WHERE services.iduser = ${id} `;

    const services = data.rows.map((service) => ({
      ...service,
      starttime: formatTime(service.starttime),
      endtime: formatTime(service.endtime),
    }));
    return services;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch services by Id Project.');
  }
}

export async function fetchTodayServices() {
  const idclinic = await CurrentClinicId();

  try {
    const data = await sql<Service>`
      SELECT 
        id, iduser, idoffice, idclient, idtype, status, date, starttime, endtime
      FROM smarthealth.services
      WHERE services.idclinic = ${idclinic}
        AND services.date = CURRENT_DATE
      ORDER BY starttime ASC
    `;
    return data.rows;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch today\'s services.');
  }
}

export async function fetchCurrentMonthServices() {
  const idclinic = await CurrentClinicId();
  const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const lastDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

  try {
    const data = await sql<Service>`
      SELECT 
        id, iduser, idoffice, idclient, idtype, status, date, starttime, endtime
      FROM smarthealth.services
      WHERE services.idclinic = ${idclinic}
        AND services.date >= ${firstDayOfMonth.toISOString().split('T')[0]}
        AND services.date <= ${lastDayOfMonth.toISOString().split('T')[0]}
      ORDER BY date ASC
    `;
    return data.rows;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch current month services.');
  }
}

export async function fetchCurrentWeekServices() {
  const idclinic = await CurrentClinicId();
  const today = new Date();
  const firstDayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 1);
  const lastDayOfWeek = new Date(firstDayOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000);

  try {
    const data = await sql<Service>`
      SELECT 
        id, iduser, idoffice, idclient, idtype, status, date, starttime, endtime
      FROM smarthealth.services
      WHERE services.idclinic = ${idclinic}
        AND services.date >= ${firstDayOfWeek.toISOString().split('T')[0]}
        AND services.date <= ${lastDayOfWeek.toISOString().split('T')[0]}
      ORDER BY date ASC
    `;
    return data.rows;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch current week services.');
  }
}