import { sql } from '@vercel/postgres';
import { ITEMS_PER_PAGE } from '@/app/lib/pagination';
import type { User } from './types';

export async function fetchUsers(idclinic: string) {
  try {
    const data = await sql<User>`
      SELECT id, name, email, role, avatarurl, category, pronoun
      FROM smarthealth.users
      WHERE users.idclinic = ${idclinic}
      ORDER BY name ASC
    `;

    return data.rows;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all users.');
  }
}

export async function fetchFilteredUsers(idclinic: string, query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const data = await sql<User>`
      SELECT id, name, email, role, avatarurl, category, pronoun
      FROM smarthealth.users
      WHERE
        (users.name ILIKE ${`%${query}%`} OR
        users.role ILIKE ${`%${query}%`} OR
        users.id::text ILIKE ${`%${query}%`} OR
        users.email ILIKE ${`%${query}%`} ) AND
        users.idclinic = ${idclinic}
      ORDER BY name ASC
      LIMIT ${ITEMS_PER_PAGE}
      OFFSET ${offset}
    `;

    return data.rows;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to search users.');
  }
}

export async function fetchUsersPages(idclinic: string, query: string) {
  try {
    const count = await sql`
      SELECT COUNT(*)
      FROM smarthealth.users
      WHERE
        (users.name ILIKE ${`%${query}%`} OR
        users.role ILIKE ${`%${query}%`} OR
        users.id::text ILIKE ${`%${query}%`} OR
        users.email ILIKE ${`%${query}%`} ) AND
        users.idclinic = ${idclinic}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number.');
  }
}

export async function fetchUserById(idclinic: string, id: string) {
  try {
    const data = await sql<User>`
      SELECT
        id, name, email, role, idclinic, avatarurl, category, pronoun
      FROM smarthealth.users
      WHERE users.id = ${id} AND users.idclinic = ${idclinic}
    `;

    return data.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch user.');
  }
}
