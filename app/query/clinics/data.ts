import { sql } from '@vercel/postgres';
import { Clinic } from './definitions';
import { auth } from '@/app/lib/auth';
import { fetchUserById } from '@/app/query/users/data';


export async function fetchClinics() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error('User session is not available.');
  }
  const user = await fetchUserById(session.user.id);

  try {
    const data = await sql<Clinic>`
      SELECT id, title, idmanager, logourl
      FROM smarthealth.clinics
      WHERE clinics.id = ${user.idclinic}
      ORDER BY title ASC
    `;
    const clinics = data.rows;
    return clinics;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch.');
  }
}

export async function fetchFilteredClinics(
  query: string,
  currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error('User session is not available.');
  }
  const user = await fetchUserById(session.user.id);

  try {
    const data = await sql<Clinic>`
      SELECT id, title, idmanager, logourl
      FROM smarthealth.clinics
      WHERE
        clinics.title ILIKE ${`%${query}%`} AND clinics.id = ${user.idclinic}
      ORDER BY title ASC
    `;
    const clinics = data.rows;
    return clinics;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to search clinics.');
  }
}
const ITEMS_PER_PAGE = 6;

export async function fetchClinicsPages(query: string) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error('User session is not available.');
  }
  const user = await fetchUserById(session.user.id);

  try {
    const count = await sql`
    SELECT COUNT(*) 
    FROM smarthealth.clinics
    WHERE clinics.id = ${user.idclinic}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number.');
  }
}

export async function fetchClinicById(id: string) {
  try {
    const data = await sql<Clinic>`
      SELECT id, title, idmanager, logourl
      FROM smarthealth.clinics
      WHERE clinics.id = ${id} `;

    const clinic = data.rows.map((clinic) => ({
      ...clinic,
    }));

    return clinic[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch clinic.');
  }
}
