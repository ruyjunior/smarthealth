import { sql } from '@vercel/postgres';
import { User } from './definitions';
import { auth } from '@/app/lib/auth';
import { CurrentClinicId } from '@/app/lib/utils';

export async function fetchUsers() {
  const idclinic = await CurrentClinicId();

  try {
    const data = await sql<User>`
      SELECT id, name, email, role, avatarurl, category, pronoun
      FROM smarthealth.users
      WHERE users.idclinic = ${idclinic}
      ORDER BY name ASC
    `;
    const users = data.rows;
    return users;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all users.');
  }
}

export async function fetchFilteredUsers(
  query: string,
  currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  const idclinic = await CurrentClinicId();

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
    `;
    const users = data.rows;
    return users;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to search users.');
  }
}
const ITEMS_PER_PAGE = 6;

export async function fetchUsersPages(query: string) {
  const idclinic = await CurrentClinicId();

  try {
    const count = await sql`
    SELECT COUNT(*) 
    FROM smarthealth.users
    WHERE users.idclinic = ${idclinic}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number.');
  }
}

export async function fetchUserById(id: string) {
  try {
    const data = await sql<User>`
      SELECT
        id, name, email, role, idclinic, avatarurl, category, pronoun
        FROM smarthealth.users
        WHERE users.id = ${id} 
        `;

    const user = data.rows.map((user) => ({
      ...user,
    }));

    return user[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch user.');
  }
}

export async function fetchUserByEmail(email: string): Promise<boolean> {
  try {
    const data = await sql`
      SELECT 1 FROM smarthealth.users WHERE users.email = ${email} LIMIT 1
    `;
    return data.rows.length > 0;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to check user by email.');
  }
}