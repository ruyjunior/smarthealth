import { sql } from '@vercel/postgres';
import { ITEMS_PER_PAGE } from '@/app/lib/pagination';
import type { Office } from './types';

export async function fetchOffices(idclinic: string) {
  try {
    const data = await sql<Office>`
      SELECT id, title, description
      FROM smarthealth.offices
      WHERE idclinic = ${idclinic}
      ORDER BY title ASC
    `;

    return data.rows;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch.');
  }
}

export async function fetchFilteredOffices(idclinic: string, query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const data = await sql<Office>`
      SELECT id, title, description
      FROM smarthealth.offices
      WHERE
        (offices.title ILIKE ${`%${query}%`} OR
        offices.description ILIKE ${`%${query}%`}) AND
        offices.idclinic = ${idclinic}
      ORDER BY title ASC
      LIMIT ${ITEMS_PER_PAGE}
      OFFSET ${offset}
    `;

    return data.rows;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to search offices.');
  }
}

export async function fetchOfficesPages(idclinic: string, query: string) {
  try {
    const count = await sql`
      SELECT COUNT(*)
      FROM smarthealth.offices
      WHERE
        (offices.title ILIKE ${`%${query}%`} OR
        offices.description ILIKE ${`%${query}%`}) AND
        offices.idclinic = ${idclinic}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number.');
  }
}

export async function fetchOfficeById(idclinic: string, id: string) {
  try {
    const data = await sql<Office>`
      SELECT id, title, description
      FROM smarthealth.offices
      WHERE offices.id = ${id} AND offices.idclinic = ${idclinic}
    `;

    return data.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch office.');
  }
}
