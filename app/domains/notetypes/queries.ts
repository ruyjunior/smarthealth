import { sql } from '@vercel/postgres';
import { ITEMS_PER_PAGE } from '@/app/lib/pagination';
import type { NoteType } from './types';

export async function fetchNoteTypes(idclinic: string) {
  try {
    const data = await sql<NoteType>`
      SELECT 
        notetypes.id, idclinic, title, fieldslabels, checkslabels
      FROM smarthealth.notetypes
      WHERE notetypes.idclinic = ${idclinic}
      ORDER BY title ASC
    `;

    return data.rows;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all notetypes.');
  }
}

export async function fetchFilteredNoteTypes(
  idclinic: string,
  query: string | undefined | null,
  currentPnumber: number | undefined | null,
) {
  const offset = currentPnumber ? (currentPnumber - 1) * ITEMS_PER_PAGE : 0;

  try {
    const data = await sql<NoteType>`
      SELECT 
        notetypes.id, idclinic, title, fieldslabels, checkslabels
      FROM smarthealth.notetypes
      WHERE notetypes.title::text ILIKE ${`%${query ?? ''}%`} AND 
            notetypes.idclinic = ${idclinic}
      ORDER BY notetypes.title ASC
      LIMIT ${ITEMS_PER_PAGE}
      OFFSET ${offset}
    `;

    return data.rows;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to search notetypes.');
  }
}

export async function fetchNoteTypesPages(idclinic: string, query: string) {
  try {
    const count = await sql`
      SELECT COUNT(*)
      FROM smarthealth.notetypes
      WHERE notetypes.title::text ILIKE ${`%${query}%`} AND notetypes.idclinic = ${idclinic}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number.');
  }
}

export async function fetchNoteTypeById(idclinic: string, id: string) {
  try {
    const data = await sql<NoteType>`
      SELECT 
        notetypes.id, idclinic, title, fieldslabels, checkslabels
      FROM smarthealth.notetypes
      WHERE notetypes.id = ${id} AND notetypes.idclinic = ${idclinic}
    `;

    return data.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch note.');
  }
}
