import { sql } from '@vercel/postgres';
import { ITEMS_PER_PAGE } from '@/app/lib/pagination';
import type { Note } from './types';

/*
 * `notes` has no idclinic column of its own, so every query here derives the
 * tenant scope from the owning client through `clients.idclinic`.
 */
export async function fetchFilteredNotes(
  idclinic: string,
  query: string | undefined | null,
  currentPnumber: number | undefined | null,
) {
  const offset = currentPnumber ? (currentPnumber - 1) * ITEMS_PER_PAGE : 0;

  try {
    const data = await sql<Note>`
      SELECT 
        notes.id, iduser, idclient, idnotetype, date, fields, checks
      FROM smarthealth.notes
      INNER JOIN smarthealth.clients ON notes.idclient = clients.id
      WHERE (notes.idclient::text ILIKE ${`%${query ?? ''}%`} OR
            clients.name::text ILIKE ${`%${query ?? ''}%`})
        AND clients.idclinic = ${idclinic}
      ORDER BY notes.date DESC
      LIMIT ${ITEMS_PER_PAGE}
      OFFSET ${offset}
    `;

    return data.rows;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to search notes.');
  }
}

export async function fetchNotesPages(idclinic: string, query: string) {
  try {
    const count = await sql`
      SELECT COUNT(*)
      FROM smarthealth.notes
      INNER JOIN smarthealth.clients ON notes.idclient = clients.id
      WHERE (notes.idclient::text ILIKE ${`%${query}%`} OR
            clients.name::text ILIKE ${`%${query}%`})
        AND clients.idclinic = ${idclinic}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number.');
  }
}

export async function fetchNoteById(idclinic: string, id: string) {
  try {
    const data = await sql<Note>`
      SELECT 
        notes.id, iduser, idclient, idnotetype, date, fields, checks
      FROM smarthealth.notes
      INNER JOIN smarthealth.clients ON notes.idclient = clients.id
      WHERE notes.id = ${id} AND clients.idclinic = ${idclinic}
    `;

    return data.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch note.');
  }
}
