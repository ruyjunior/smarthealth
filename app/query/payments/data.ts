import { sql } from '@vercel/postgres';
import { Payment } from './definitions';
import { CurrentClinicId, formatTime } from '@/app/lib/utils';
import { auth } from '@/app/lib/auth';
import { fetchUserById } from '@/app/query/users/data';
import { error } from 'console';


export async function fetchPayments() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error('User session is not available.');
  }
  const user = await fetchUserById(session.user.id);

  try {
    const data = await sql<Payment>`
    SELECT 
      id, title, description, amount, date
    FROM smarthealth.payments
    WHERE payments.idclinic = ${user.idclinic}
    ORDER BY date ASC
    `;
    const payments = data.rows;
    return payments;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all Payments.');
  }
}

export async function fetchFilteredPayments(
  query: string | undefined | null,
  currentPnumber: number | undefined | null) {
  const offset = currentPnumber ? (currentPnumber - 1) * ITEMS_PER_PAGE : 0;

  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error('User session is not available.');
  }
  const user = await fetchUserById(session.user.id);

  try {
    const data = await sql<Payment>`
    SELECT 
      id, title, description, amount, date
    FROM smarthealth.payments
    WHERE 
      (payments.description::text ILIKE ${`%${query ?? ''}%`} OR
      payments.title::text ILIKE ${`%${query ?? ''}%`}) 
      AND
      payments.idclinic = ${user.idclinic}
    ORDER BY payments.date DESC
    LIMIT ${ITEMS_PER_PAGE}
    OFFSET ${offset}
  `;
    const payments = data.rows;
    return payments;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to search sayments.');
  }
}
const ITEMS_PER_PAGE = 10;

export async function fetchPaymentsPages(query: string) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error('User session is not available.');
  }
  const user = await fetchUserById(session.user.id);

  try {
    const count = await sql`
    SELECT COUNT(*) 
    FROM smarthealth.payments
    WHERE payments.idclinic = ${user.idclinic}`;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number.');
  }
}

export async function fetchPaymentById(id: string) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error('User session is not available.');
  }
  const user = await fetchUserById(session.user.id);

  try {
    const data = await sql<Payment>`
      SELECT 
      id, title, description, amount, date
      FROM smarthealth.payments
      WHERE payments.id = ${id} AND payments.idclinic = ${user.idclinic}
    `;

    const payment = data.rows.map((payment) => ({
      ...payment,
    }));
    return payment[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch payment.');
  }
}

export async function fetchPaymentsByUser(id: string) {

  try {
    const data = await sql<Payment>`
      SELECT 
      id, title, description, amount, date
      FROM smarthealth.payments
      WHERE payments.iduser = ${id} `;

    const payments = data.rows;
    return payments;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch payments by Id User.');
  }
}

export async function fetchTodayPayments() {
  const idclinic = await CurrentClinicId();

  try {
    const data = await sql<Payment>`
      SELECT 
      id, title, description, amount, date
      FROM smarthealth.payments
      WHERE payments.idclinic = ${idclinic}
        AND payments.date = CURRENT_DATE
      ORDER BY date ASC
    `;
    return data.rows;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch today\'s payments.');
  }
}

export async function fetchCurrentMonthPayments() {
  const idclinic = await CurrentClinicId();
  const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const lastDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

  try {
    const data = await sql<Payment>`
      SELECT 
      id, title, description, amount, date
      FROM smarthealth.payments
      WHERE payments.idclinic = ${idclinic}
        AND payments.date >= ${firstDayOfMonth.toISOString().split('T')[0]}
        AND payments.date <= ${lastDayOfMonth.toISOString().split('T')[0]}
      ORDER BY date ASC
    `;
    return data.rows;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch current month payments.');
  }
}

export async function fetchCurrentWeekPayments() {
  const idclinic = await CurrentClinicId();
  const today = new Date();
  const firstDayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 1);
  const lastDayOfWeek = new Date(firstDayOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000);

  try {
    const data = await sql<Payment>`
      SELECT 
      id, title, description, amount, date
      FROM smarthealth.payments
      WHERE payments.idclinic = ${idclinic}
        AND payments.date >= ${firstDayOfWeek.toISOString().split('T')[0]}
        AND payments.date <= ${lastDayOfWeek.toISOString().split('T')[0]}
      ORDER BY date ASC
    `;
    return data.rows;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch current week payments.');
  }
}
export async function fetchPaymentsPeriod(start: string, end: string, currentPage: number): Promise<Payment[]> {
  const idclinic = await CurrentClinicId();
  const offset = currentPage ? (currentPage - 1) * ITEMS_PER_PAGE : 0;
  console.log('Fetching payments from', start, 'to', end);

  try {
    const data = await sql<Payment>`
      SELECT 
      id, title, description, amount, date
      FROM smarthealth.payments
      WHERE payments.idclinic = ${idclinic}
        AND payments.date >= ${start}
        AND payments.date <= ${end}
      ORDER BY date ASC
      LIMIT ${ITEMS_PER_PAGE}
      OFFSET ${offset}

    `;
    return data.rows;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch payments by period.');
  }
}