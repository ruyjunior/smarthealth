import { sql } from '@vercel/postgres';
import { Type } from './definitions';
import { auth } from '@/app/lib/auth';
import { fetchUserById } from '@/app/query/users/data';

export async function fetchTypes() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error('User session is not available.');
  }
  const user = await fetchUserById(session.user.id);

  try {
    const data = await sql<Type>`
      SELECT id, title, description, price
      FROM smarthealth.types
      WHERE types.idclinic = ${user.idclinic}
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

  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error('User session is not available.');
  }
  const user = await fetchUserById(session.user.id);

  try {
    const data = await sql<Type>`
      SELECT id, title, description, price
      FROM smarthealth.types
      WHERE
        (types.title ILIKE ${`%${query}%`} OR
        types.description ILIKE ${`%${query}%`}) AND
        types.idclinic = ${user.idclinic}
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
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error('User session is not available.');
  }
  const user = await fetchUserById(session.user.id);

  try {
    const count = await sql`
      SELECT COUNT(*) FROM smarthealth.types
      WHERE types.idclinic = ${user.idclinic}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number.');
  }
}

export async function fetchTypeById(id: string) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error('User session is not available.');
  }
  const user = await fetchUserById(session.user.id);

  try {
    const data = await sql<Type>`
      SELECT id, title, description, price
      FROM smarthealth.types
      WHERE types.id = ${id} AND types.idclinic = ${user.idclinic}
    `;

    const type = data.rows.map((type) => ({
      ...type,
    }));

    return type[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch type.');
  }
}
