'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { sql } from '@vercel/postgres';
import { toPgArray } from '@/app/lib/utils';
import { getCurrentClinicId } from '@/app/lib/session';
import { fetchClientById } from '@/app/domains/clients/queries';

const FormSchema = z.object({
  id: z.string(),
  iduser: z.string(),
  idclient: z.string(),
  idnotetype: z.string(),
  fields: z.array(z.string()),
  checks: z.array(z.string()),
  date: z.string(),
});

const CreateNote = FormSchema.omit({ id: true });
const UpdateNote = FormSchema.omit({ id: true });

export type State = {
  message?: string | null;
  errors?: {
    iduser?: string[];
    idclient?: string[];
    idnotetype?: string[];
    fields?: string[];
    checks?: string[];
    date?: string[];
  };
};

export async function createNote(prevState: State, formData: FormData) {
  const validatedFields = CreateNote.safeParse({
    iduser: formData.get('iduser'),
    idclient: formData.get('idclient'),
    idnotetype: formData.get('idnotetype'),
    fields: formData.getAll('fields[]'),
    checks: formData.getAll('checks[]'),
    date: formData.get('date'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create.',
    };
  }

  const { iduser, idclient, date, idnotetype, fields, checks } = validatedFields.data;

  const idclinic = await getCurrentClinicId();
  const client = await fetchClientById(idclinic, idclient);

  if (!client) {
    return { message: 'Paciente não encontrado nesta clínica.' };
  }

  try {
    const inserted = await sql`
        INSERT INTO smarthealth.notes ( 
          iduser, idclient, date, idnotetype, fields, checks
        )
        SELECT ${iduser}, ${idclient}, ${date}, ${idnotetype}, ${toPgArray(fields)}, ${toPgArray(checks)}
        WHERE
          EXISTS (SELECT 1 FROM smarthealth.users WHERE id = ${iduser} AND idclinic = ${idclinic}) AND
          EXISTS (SELECT 1 FROM smarthealth.notetypes WHERE id = ${idnotetype} AND idclinic = ${idclinic})
        RETURNING id
        `;

    if (inserted.rowCount === 0) {
      return { message: 'Profissional ou tipo de ficha não pertencem a esta clínica.' };
    }
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to Create note.',
    };
  }
  revalidatePath('/clients/' + idclient + '/view');
  redirect('/clients/' + idclient + '/view');
}

export async function updateNote(id: string, prevState: State, formData: FormData) {
  const validatedFields = UpdateNote.safeParse({
    iduser: formData.get('iduser'),
    idclient: formData.get('idclient'),
    idnotetype: formData.get('idnotetype'),
    fields: formData.getAll('fields[]'),
    checks: formData.getAll('checks[]'),
    date: formData.get('date'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update note.',
    };
  }

  const { iduser, idclient, date, idnotetype, fields, checks } = validatedFields.data;

  const idclinic = await getCurrentClinicId();
  const client = await fetchClientById(idclinic, idclient);

  if (!client) {
    return { message: 'Paciente não encontrado nesta clínica.' };
  }

  try {
    const updated = await sql`
    UPDATE smarthealth.notes
    SET 
      iduser = ${iduser},
      idclient = ${idclient},
      date = ${date}, 
      idnotetype = ${idnotetype},
      fields = ${toPgArray(fields)},
      checks = ${toPgArray(checks)}
    WHERE id = ${id}
      AND EXISTS (
        SELECT 1 FROM smarthealth.clients
        WHERE clients.id = notes.idclient AND clients.idclinic = ${idclinic}
      )
      AND EXISTS (SELECT 1 FROM smarthealth.users WHERE id = ${iduser} AND idclinic = ${idclinic})
      -- the stored ficha type can be older than this rule and the form cannot change it
      AND (
        idnotetype = ${idnotetype}
        OR EXISTS (SELECT 1 FROM smarthealth.notetypes WHERE id = ${idnotetype} AND idclinic = ${idclinic})
      )
  `;

    if (updated.rowCount === 0) {
      return { message: 'Registro não encontrado ou vínculos de outra clínica.' };
    }
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Update note.' };
  }

  revalidatePath('/clients/' + idclient + '/view');
  redirect('/clients/' + idclient + '/view');
}

export async function deleteNote(id: string) {
  const idclinic = await getCurrentClinicId();

  await sql`
    DELETE FROM smarthealth.notes
    WHERE id = ${id}
      AND EXISTS (
        SELECT 1 FROM smarthealth.clients
        WHERE clients.id = notes.idclient AND clients.idclinic = ${idclinic}
      )
  `;
  revalidatePath('/notes');
}
