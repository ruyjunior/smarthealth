import { sql } from '@vercel/postgres';
import { NoteType } from './definitions';
import { CurrentClinicId } from '@/app/lib/utils';

export async function fetchNoteTypes() {
  const idclinic = await CurrentClinicId();

  try {
    const data = await sql<NoteType>`
    SELECT 
      notetypes.id, idclinic, title, fieldslabels, checkslabels
    FROM smarthealth.notetypes
    WHERE notetypes.idclinic = ${idclinic}
    ORDER BY title ASC
    `;
    const notetypes = data.rows;
    return notetypes;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all notetypes.');
  }
}

export async function fetchFilteredNoteTypes(
  query: string | undefined | null,
  currentPnumber: number | undefined | null) {

  const idclinic = await CurrentClinicId();
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

    const notetypes = data.rows;
    return notetypes;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to search notetypes.');
  }
}
const ITEMS_PER_PAGE = 6;

export async function fetchNoteTypesPages(query: string) {
  const idclinic = await CurrentClinicId();

  try {
    const count = await sql`
    SELECT COUNT(*) 
    FROM smarthealth.notetypes
    WHERE notetypes.idclinic = ${idclinic}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number.');
  }
}

export async function fetchNoteTypeById(id: string) {

  try {
    const data = await sql<NoteType>`
    SELECT 
      notetypes.id, idclinic, title, fieldslabels, checkslabels
    FROM smarthealth.notetypes
    WHERE notetypes.id = ${id} 
    `;

    const note = data.rows;
    return note[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch note.');
  }
}