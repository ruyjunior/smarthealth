'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { sql } from '@vercel/postgres';
import { toPgArray } from '@/app/lib/utils';

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

  try {
    await sql`
        INSERT INTO smarthealth.notes ( 
          iduser, idclient, date, idnotetype, fields, checks
        )
        VALUES (${iduser}, ${idclient}, ${date}, ${idnotetype}, ${toPgArray(fields)}, ${toPgArray(checks)})
        `;
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to Create note.',
    };
  }
  revalidatePath('/clients/' + idclient + '/view');
  redirect('/clients/' + idclient + '/view');
}

export async function updateNote(
  id: string,
  prevState: State,
  formData: FormData
) {

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
  const sanitizedEndDate = date || null;

  try {
    await sql`
    UPDATE smarthealth.notes
    SET 
      iduser = ${iduser},
      idclient = ${idclient},
      date = ${date}, 
      idnotetype = ${idnotetype},
      fields = ${toPgArray(fields)},
      checks = ${toPgArray(checks)}
    WHERE id = ${id}
  `;
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Update note.' };
  }

  revalidatePath('/clients/' + idclient + '/view');
  redirect('/clients/' + idclient + '/view');
}

export async function deleteNote(id: string) {
  //throw new Error('Failed to Delete Invoice');

  await sql`DELETE FROM smarthealth.notes WHERE id = ${id}`;
  revalidatePath('/notes');
}