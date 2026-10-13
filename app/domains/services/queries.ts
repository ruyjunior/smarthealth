import { sql } from '@vercel/postgres';
import { ITEMS_PER_PAGE } from '@/app/lib/pagination';
import { formatTime } from '@/app/lib/utils';
import type { Service } from './types';

export async function fetchServices(idclinic: string) {
  try {
    const data = await sql<Service>`
      SELECT 
        id, iduser, idoffice, idclient, idtype, status, date, starttime, endtime,
        (endtime - starttime)::TIME AS totaltime
      FROM smarthealth.services
      WHERE services.idclinic = ${idclinic}
      ORDER BY date, starttime ASC
    `;

    return data.rows;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all services.');
  }
}

export async function fetchFilteredServices(
  idclinic: string,
  query: string | undefined | null,
  currentPnumber: number | undefined | null,
) {
  const offset = currentPnumber ? (currentPnumber - 1) * ITEMS_PER_PAGE : 0;
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
        AND services.idclinic = ${idclinic}
      ORDER BY services.date DESC, services.starttime ASC
      LIMIT ${ITEMS_PER_PAGE}
      OFFSET ${offset}
    `;

    return data.rows;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to search services.');
  }
}

export async function fetchServicesPages(idclinic: string, query: string) {
  try {
    const count = await sql`
      SELECT COUNT(*)
      FROM smarthealth.services
      LEFT JOIN smarthealth.clients ON services.idclient = clients.id
      WHERE
        (clients.name::text ILIKE ${`%${query}%`} OR
        clients.cpf::text ILIKE ${`%${query}%`} OR
        services.id::text ILIKE ${`%${query}%`}) AND
        services.idclinic = ${idclinic}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number.');
  }
}

export async function fetchServiceById(idclinic: string, id: string) {
  try {
    const data = await sql<Service>`
      SELECT 
        id, iduser, idoffice, idclient, idtype, status, date, starttime, endtime
      FROM smarthealth.services
      WHERE services.id = ${id} AND services.idclinic = ${idclinic}
    `;

    return data.rows.map((service) => ({
      ...service,
      starttime: formatTime(service.starttime),
      endtime: formatTime(service.endtime),
    }))[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch service.');
  }
}

export async function fetchTodayServices(idclinic: string) {
  const localToday = new Date();
  localToday.setHours(0, 0, 0, 0);
  const localDateString = localToday.toISOString().split('T')[0];

  try {
    const data = await sql<Service>`
      SELECT 
        id, iduser, idoffice, idclient, idtype, status, date, starttime, endtime
      FROM smarthealth.services
      WHERE services.idclinic = ${idclinic}
        AND DATE(services.date AT TIME ZONE 'UTC') = ${localDateString}
      ORDER BY starttime ASC
    `;

    return data.rows;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error("Failed to fetch today's services.");
  }
}

export async function fetchCurrentMonthServices(idclinic: string) {
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

export async function fetchCurrentWeekServices(idclinic: string) {
  const today = new Date();
  const firstDayOfWeek = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - today.getDay() + 1,
  );
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
