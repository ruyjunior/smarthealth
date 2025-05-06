import { sql } from '@vercel/postgres';
import { User } from './definitions';

export async function fetchUsers() {
  
  try {
    const data = await sql<User>`
      SELECT id, name, email, role
      FROM smarthealth.users
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
  
  try {
    const data = await sql<User>`
      SELECT id, name, email, role
      FROM smarthealth.users
      WHERE
        users.name ILIKE ${`%${query}%`} OR
        users.role ILIKE ${`%${query}%`} OR
        users.email ILIKE ${`%${query}%`} 
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
  try {
    const count = await sql`SELECT COUNT(*) FROM smarthealth.users`;

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
        users.id,
        users.name,
        users.email,
        users.role
        FROM smarthealth.users
        WHERE users.id = ${id} `;

    const user = data.rows.map((user) => ({
      ...user,
    }));
    
    return user[0];
    console.log( 'User: ' + user[0]);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch user.');
  }
}
