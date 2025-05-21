import { sql } from '@vercel/postgres';
import { Note } from './definitions';
import { formatTime } from '@/app/lib/utils';

export async function fetchNotes() {

  try {
    const data = await sql<Note>`
    SELECT 
      id, iduser, idclient, idnotetype, date, fields, checks
    FROM smarthealth.notes
    ORDER BY date ASC    
    `;
    const notes = data.rows;
    return notes;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all notes.');
  }
}

export async function fetchFilteredNotes(
  query: string | undefined | null,
  currentPnumber: number | undefined | null) {

  const offset = currentPnumber ? (currentPnumber - 1) * ITEMS_PER_PAGE : 0;
  try {
    const data = await sql<Note>`
    SELECT 
      notes.id, iduser, idclient, idnotetype, date, fields, checks
    FROM smarthealth.notes
    LEFT JOIN smarthealth.clients ON notes.idclient = clients.id
    WHERE notes.idclient::text ILIKE ${`%${query ?? ''}%`} OR
          clients.name::text ILIKE ${`%${query ?? ''}%`}
    ORDER BY notes.date DESC
    LIMIT ${ITEMS_PER_PAGE}
    OFFSET ${offset}
  `;

    const notes = data.rows;
    return notes;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to search notes.');
  }
}
const ITEMS_PER_PAGE = 6;

export async function fetchNotesPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*) FROM smarthealth.notes`;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number.');
  }
}

export async function fetchNoteById(id: string) {
  try {
    const data = await sql<Note>`
    SELECT 
      id, iduser, idclient, idnotetype, date, fields, checks
    FROM smarthealth.notes
    WHERE notes.id = ${id} 
    `;

    const note = data.rows;
    return note[0];
    //console.log('Note: ' + note[0]);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch note.');
  }
}

export async function fetchNotesByClient(id: string) {
  try {
    const data = await sql<Note>`
      SELECT 
        id, iduser, idclient, idnotetype, date, fields, checks
      FROM smarthealth.notes
      WHERE notes.idclient = ${id} 
      ORDER BY date ASC
      `;

    const notes = data.rows;
    return notes;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch notes by Id Project.');
  }
}
