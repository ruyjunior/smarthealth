import { sql } from '@vercel/postgres';
import { Office } from './definitions';

export async function fetchOffices() {

  try {
    const data = await sql<Office>`
      SELECT id, title, description
      FROM smarthealth.offices
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

  try {
    const data = await sql<Office>`
      SELECT id, title, description
      FROM smarthealth.offices
      WHERE
        offices.title ILIKE ${`%${query}%`} OR
        offices.description ILIKE ${`%${query}%`}
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
  try {
    const count = await sql`SELECT COUNT(*) FROM smarthealth.offices`;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number.');
  }
}

export async function fetchOfficeById(id: string) {
  try {
    const data = await sql<Office>`
      SELECT id, title, description
      FROM smarthealth.offices
      WHERE offices.id = ${id} `;

    const office = data.rows.map((office) => ({
      ...office,
    }));

    return office[0];
    console.log('Office: ' + office[0]);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch office.');
  }
}
