import { sql } from '@vercel/postgres';
import { Credit } from './definitions';
import { auth } from '@/app/lib/auth';
import { fetchUserById } from '@/app/query/users/data';


export async function fetchCredits() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error('User session is not available.');
  }
  const user = await fetchUserById(session.user.id);

  try {
    const data = await sql<Credit>`
      SELECT id, idclinic, date, expires, email, amount
      FROM smarthealth.credits
      WHERE idclinic = ${user.idclinic}
      ORDER BY date DESC
    `;
    const credits = data.rows;
    return credits;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch.');
  }
}