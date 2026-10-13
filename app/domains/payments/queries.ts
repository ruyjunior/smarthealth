import { sql } from '@vercel/postgres';
import { PAYMENTS_ITEMS_PER_PAGE } from '@/app/lib/pagination';
import type { Payment } from './types';

export async function fetchFilteredPayments(
  idclinic: string,
  query: string | undefined | null,
  currentPnumber: number | undefined | null,
) {
  const offset = currentPnumber ? (currentPnumber - 1) * PAYMENTS_ITEMS_PER_PAGE : 0;
  try {
    const data = await sql<Payment>`
      SELECT 
        id, title, description, amount, date
      FROM smarthealth.payments
      WHERE 
        (payments.description::text ILIKE ${`%${query ?? ''}%`} OR
        payments.title::text ILIKE ${`%${query ?? ''}%`})
        AND payments.idclinic = ${idclinic}
      ORDER BY payments.date DESC
      LIMIT ${PAYMENTS_ITEMS_PER_PAGE}
      OFFSET ${offset}
    `;

    return data.rows;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to search payments.');
  }
}

export async function fetchPaymentsPages(idclinic: string, query: string) {
  try {
    const count = await sql`
      SELECT COUNT(*)
      FROM smarthealth.payments
      WHERE
        (payments.description::text ILIKE ${`%${query}%`} OR
        payments.title::text ILIKE ${`%${query}%`}) AND
        payments.idclinic = ${idclinic}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / PAYMENTS_ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number.');
  }
}

export async function fetchPaymentById(idclinic: string, id: string) {
  try {
    const data = await sql<Payment>`
      SELECT 
        id, title, description, amount, date
      FROM smarthealth.payments
      WHERE payments.id = ${id} AND payments.idclinic = ${idclinic}
    `;

    return data.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch payment.');
  }
}
