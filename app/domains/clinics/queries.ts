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

/**
 * Clínicas com logo cadastrada, para a vitrine pública do site.
 *
 * É a única consulta sem escopo de clínica de propósito: a página inicial é
 * pública e mostra os clientes da plataforma. Só devolve título e logo, e
 * degrada para lista vazia em caso de erro — uma instabilidade do banco não
 * pode derrubar a página de vendas.
 */
export async function fetchPublicClinicLogos(): Promise<
  Pick<Clinic, 'id' | 'title' | 'logourl'>[]
> {
  try {
    const data = await sql<Pick<Clinic, 'id' | 'title' | 'logourl'>>`
      SELECT id, title, logourl
      FROM smarthealth.clinics
      WHERE logourl IS NOT NULL AND logourl <> ''
      ORDER BY title
    `;

    if (data.rows.length === 0) {
      // a seção some da home quando não há logo; o log evita que uma falha
      // transitória passe despercebida
      console.warn('Nenhuma clínica com logo cadastrada para a vitrine pública.');
    }

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    return [];
  }
}
