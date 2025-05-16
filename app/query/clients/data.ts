import { sql } from '@vercel/postgres';
import { Client } from './definitions';

export async function fetchClients() {
  
  try {
    const data = await sql<Client>`
      SELECT id, cpf, name, birth, email, phone, cep
      FROM smarthealth.clients
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
  
  try {
    const data = await sql<Client>`
      SELECT id, cpf, name, birth, email, phone, cep
      FROM smarthealth.clients
      WHERE
        clients.id::text ILIKE ${`%${query}%`} OR
        clients.name ILIKE ${`%${query}%`} OR
        clients.email ILIKE ${`%${query}%`} OR
        clients.birth::text ILIKE ${`%${query}%`} OR
        clients.cpf ILIKE ${`%${query}%`}
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
  try {
    const count = await sql`SELECT COUNT(*) FROM smarthealth.clients`;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number.');
  }
}

export async function fetchClientById(id: string) {
  try {
    const data = await sql<Client>`
      SELECT
        clients.id,
        clients.cpf,
        clients.name,
        clients.birth,
        clients.email,
        clients.phone,
        clients.cep
        FROM smarthealth.clients
        WHERE clients.id = ${id} `;

    const client = data.rows.map((client) => ({
      ...client,
    }));
    
    return client[0];
    console.log( 'Client: ' + client[0]);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch client.');
  }
}
