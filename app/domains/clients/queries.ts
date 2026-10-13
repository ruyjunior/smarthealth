import { sql } from '@vercel/postgres';
import { ITEMS_PER_PAGE } from '@/app/lib/pagination';
import type { Client } from './types';

export async function fetchClients(idclinic: string) {
  try {
    const data = await sql<Client>`
      SELECT id, cpf, name, birth, email, phone, cep, pronoun
      FROM smarthealth.clients
      WHERE clients.idclinic = ${idclinic}
      ORDER BY name ASC
    `;

    return data.rows;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all clients.');
  }
}

export async function fetchFilteredClients(
  idclinic: string,
  query: string,
  currentPage: number | undefined | null,
) {
  const page = currentPage ?? 1;
  const offset = (page - 1) * ITEMS_PER_PAGE;
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
        clients.idclinic = ${idclinic}
      ORDER BY name ASC
      LIMIT ${ITEMS_PER_PAGE}
      OFFSET ${offset}
    `;

    return data.rows;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to search clients.');
  }
}

export async function fetchClientsPages(idclinic: string, query: string) {
  try {
    const count = await sql`
      SELECT COUNT(*)
      FROM smarthealth.clients
      WHERE
        (clients.id::text ILIKE ${`%${query}%`} OR
        clients.name ILIKE ${`%${query}%`} OR
        clients.email ILIKE ${`%${query}%`} OR
        clients.birth::text ILIKE ${`%${query}%`} OR
        clients.cpf ILIKE ${`%${query}%`} ) AND
        clients.idclinic = ${idclinic}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number.');
  }
}

export async function fetchClientById(idclinic: string, id: string) {
  try {
    const data = await sql<Client>`
      SELECT
        id, cpf, name, birth, email, phone, cep, pronoun
      FROM smarthealth.clients
      WHERE id = ${id} AND idclinic = ${idclinic}
    `;

    return data.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch client.');
  }
}
