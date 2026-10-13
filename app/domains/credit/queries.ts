import { sql } from '@vercel/postgres';
import type { Credit } from './types';

export async function fetchCredits(idclinic: string) {
  try {
    const data = await sql<Credit>`
      SELECT id, idclinic, date, expires, email, amount, type
      FROM smarthealth.credits
      WHERE idclinic = ${idclinic}
      ORDER BY expires DESC
    `;

    return data.rows;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch.');
  }
}

export async function fetchCreditById(idclinic: string, id: string) {
  try {
    const data = await sql<Credit>`
      SELECT id, idclinic, date, expires, email, amount, type
      FROM smarthealth.credits
      WHERE id = ${id} AND idclinic = ${idclinic}
    `;

    return data.rows[0];
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch.');
  }
}
