import { sql } from '@vercel/postgres';
import { ITEMS_PER_PAGE } from '@/app/lib/pagination';
import type { Clinic } from './types';

export async function fetchFilteredClinics(idclinic: string, query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const data = await sql<Clinic>`
      SELECT id, title, idmanager, logourl, cnpj, address, phone, siteurl
      FROM smarthealth.clinics
      WHERE
        clinics.title ILIKE ${`%${query}%`} AND clinics.id = ${idclinic}
      ORDER BY title ASC
      LIMIT ${ITEMS_PER_PAGE}
      OFFSET ${offset}
    `;

    return data.rows;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to search clinics.');
  }
}

export async function fetchClinicsPages(idclinic: string, query: string) {
  try {
    const count = await sql`
      SELECT COUNT(*)
      FROM smarthealth.clinics
      WHERE clinics.title ILIKE ${`%${query}%`} AND clinics.id = ${idclinic}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number.');
  }
}

/*
 * `clinics.id` *is* the tenant id that other tables reference as `idclinic`, so
 * this lookup only ever resolves the caller's own clinic.
 */
export async function fetchClinicById(idclinic: string) {
  try {
    const data = await sql<Clinic>`
      SELECT id, title, idmanager, logourl, cnpj, address, phone, siteurl
      FROM smarthealth.clinics
      WHERE clinics.id = ${idclinic}
    `;

    return data.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch clinic.');
  }
}
