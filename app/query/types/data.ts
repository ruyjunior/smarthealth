import { sql } from '@vercel/postgres';
import { Type } from './definitions';

export async function fetchTypes() {

  try {
    const data = await sql<Type>`
      SELECT id, title, description, price
      FROM smarthealth.types
      ORDER BY title ASC
    `;
    const types = data.rows;
    return types;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch.');
  }
}

export async function fetchFilteredTypes(
  query: string,
  currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const data = await sql<Type>`
      SELECT id, title, description, price
      FROM smarthealth.types
      WHERE
        types.title ILIKE ${`%${query}%`} OR
        types.description ILIKE ${`%${query}%`}
      ORDER BY title ASC
    `;
    const types = data.rows;
    return types;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to search types.');
  }
}
const ITEMS_PER_PAGE = 6;

export async function fetchTypesPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*) FROM smarthealth.types`;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number.');
  }
}

export async function fetchTypeById(id: string) {
  try {
    const data = await sql<Type>`
      SELECT id, title, description, price
      FROM smarthealth.types
      WHERE types.id = ${id} `;

    const type = data.rows.map((type) => ({
      ...type,
    }));

    return type[0];
    console.log('Type: ' + type[0]);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch type.');
  }
}
