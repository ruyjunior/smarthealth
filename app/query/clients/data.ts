import { sql } from '@vercel/postgres';
import { Client } from './definitions';
import { auth } from '@/app/lib/auth';
import { fetchUserById } from '@/app/query/users/data';


export async function fetchClients() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error('User session is not available.');
  }
  const user = await fetchUserById(session.user.id);

  try {
    const data = await sql<Client>`
      SELECT id, cpf, name, birth, email, phone, cep, pronoun
      FROM smarthealth.clients
      WHERE clients.idclinic = ${user.idclinic}
      ORDER BY name ASC
    `;
    const clients = data.rows;
    return clients;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all clients.');
  }
}

export async function fetchFilteredClients(
  query: string,
  currentPage: number | undefined | null) {

  const page = currentPage ?? 1;
  const offset = (page - 1) * ITEMS_PER_PAGE;
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error('User session is not available.');
  }
  const user = await fetchUserById(session.user.id);

  try {
    const data = await sql<Client>`
      SELECT id, cpf, name, birth, email, phone, cep, pronoun
      FROM smarthealth.clients
      WHERE
        (clients.id::text ILIKE ${`%${query}%`} OR
        clients.name ILIKE ${`%${query}%`} OR
        clients.email ILIKE ${`%${query}%`} OR
        clients.birth::text ILIKE ${`%${query}%`} OR
        clients.cpf ILIKE ${`%${query}%`} ) AND
        clients.idclinic = ${user.idclinic}
      ORDER BY name ASC
    `;
    const clients = data.rows;
    return clients;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to search clients.');
  }
}
const ITEMS_PER_PAGE = 6;

export async function fetchClientsPages(query: string) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error('User session is not available.');
  }
  const user = await fetchUserById(session.user.id);

  try {
    const count = await sql`
    SELECT COUNT(*) 
    FROM smarthealth.clients 
    WHERE clients.idclinic = ${user.idclinic}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number.');
  }
}

export async function fetchClientById(id: string) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error('User session is not available.');
  }
  const user = await fetchUserById(session.user.id);

  try {
    const data = await sql<Client>`
      SELECT
        id, cpf, name, birth, email, phone, cep, pronoun
      FROM smarthealth.clients
      WHERE id = ${id} AND idclinic = ${user.idclinic}
    `;

    const client = data.rows.map((client) => ({
      ...client,
    }));

    return client[0];
    console.log('Client: ' + client[0]);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch client.');
  }
}
