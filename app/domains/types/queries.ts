import { sql } from '@vercel/postgres';
import { ITEMS_PER_PAGE } from '@/app/lib/pagination';
import type { Type } from './types';

export async function fetchTypes(idclinic: string) {
  try {
    const data = await sql<Type>`
      SELECT id, title, description, price
      FROM smarthealth.types
      WHERE types.idclinic = ${idclinic}
      ORDER BY title ASC
    `;

    return data.rows;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch.');
  }
}

export async function fetchFilteredTypes(idclinic: string, query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const data = await sql<Type>`
      SELECT id, title, description, price
      FROM smarthealth.types
      WHERE
        (types.title ILIKE ${`%${query}%`} OR
        types.description ILIKE ${`%${query}%`}) AND
        types.idclinic = ${idclinic}
      ORDER BY title ASC
      LIMIT ${ITEMS_PER_PAGE}
      OFFSET ${offset}
    `;

    return data.rows;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to search types.');
  }
}

export async function fetchTypesPages(idclinic: string, query: string) {
  try {
    const count = await sql`
      SELECT COUNT(*)
      FROM smarthealth.types
      WHERE
        (types.title ILIKE ${`%${query}%`} OR
        types.description ILIKE ${`%${query}%`}) AND
        types.idclinic = ${idclinic}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number.');
  }
}

export async function fetchTypeById(idclinic: string, id: string) {
  try {
    const data = await sql<Type>`
      SELECT id, title, description, price
      FROM smarthealth.types
      WHERE types.id = ${id} AND types.idclinic = ${idclinic}
    `;

    return data.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch type.');
  }
}
