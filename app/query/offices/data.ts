import { sql } from '@vercel/postgres';
import { Office } from './definitions';
import { auth } from '@/app/lib/auth';
import { fetchUserById } from '@/app/query/users/data';


export async function fetchOffices() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error('User session is not available.');
  }
  const user = await fetchUserById(session.user.id);

  try {
    const data = await sql<Office>`
      SELECT id, title, description
      FROM smarthealth.offices
      WHERE idclinic = ${user.idclinic}
      ORDER BY title ASC
    `;
    const offices = data.rows;
    return offices;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch.');
  }
}

export async function fetchFilteredOffices(
  query: string,
  currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error('User session is not available.');
  }
  const user = await fetchUserById(session.user.id);

  try {
    const data = await sql<Office>`
      SELECT id, title, description
      FROM smarthealth.offices
      WHERE
        (offices.title ILIKE ${`%${query}%`} OR
        offices.description ILIKE ${`%${query}%`}) AND
        offices.idclinic = ${user.idclinic}
      ORDER BY title ASC
    `;
    const offices = data.rows;
    return offices;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to search offices.');
  }
}
const ITEMS_PER_PAGE = 6;

export async function fetchOfficesPages(query: string) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error('User session is not available.');
  }
  const user = await fetchUserById(session.user.id);

  try {
    const count = await sql`
    SELECT COUNT(*) 
    FROM smarthealth.offices 
    WHERE idclinic = ${user.idclinic}`;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number.');
  }
}

export async function fetchOfficeById(id: string) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error('User session is not available.');
  }
  const user = await fetchUserById(session.user.id);

  try {
    const data = await sql<Office>`
      SELECT id, title, description
      FROM smarthealth.offices
      WHERE offices.id = ${id} AND offices.idclinic = ${user.idclinic}
    `;

    const office = data.rows.map((office) => ({
      ...office,
    }));

    return office[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch office.');
  }
}
