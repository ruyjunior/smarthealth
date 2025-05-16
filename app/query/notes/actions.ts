'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { sql } from '@vercel/postgres';
import { Weight } from 'lucide-react';

const FormSchema = z.object({
  id: z.string(),
  iduser: z.string(),
  idclient: z.string(),
  date: z.string(),
  weight: z.string(),
  height: z.string().optional(),
  fat: z.string().optional(),
  note: z.string().optional(),
});

const CreateNote = FormSchema.omit({ id: true });
const UpdateNote = FormSchema.omit({ id: true });

export type State = {
  message?: string;
  errors?: {
    iduser?: string[];
    idclient?: string[];
    date?: string[];
    note?: string[];
    fat?: string[];
    height?: string[];
    weight?: string[];
  };
};

export async function createNote(prevState: State, formData: FormData) {
  console.log('Form Data: ', formData);
  const validatedFields = CreateNote.safeParse({
    iduser: formData.get('iduser'),
    idclient: formData.get('idclient'),
    date: formData.get('date'),
    note: formData.get('note'),
    fat: formData.get('fat'),
    height: formData.get('height'),
    weight: formData.get('weight')
  });

  console.log('Validated Fields: ', validatedFields.success);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create.',
    };
  }

  const { iduser, idclient, date, note, fat, height, weight } = validatedFields.data;

  try {
    await sql`
        INSERT INTO smarthealth.notes ( 
          iduser, idclient, date, note, fat, height, weight
        )
        VALUES (${iduser}, ${idclient}, ${date}, ${note}, ${fat}, ${height}, ${weight})
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
    date: formData.get('date'),
    note: formData.get('note'),
    fat: formData.get('fat'),
    height: formData.get('height'),
    weight: formData.get('weight')
  });


  if (!validatedFields.success) {
    console.log('Error: ', validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update note.',
    };
  }

  const { iduser, idclient, date, note, fat, height, weight } = validatedFields.data;
  const sanitizedEndDate = date || null;

  try {
    await sql`
    UPDATE smarthealth.notes
    SET 
      iduser = ${iduser},
      idclient = ${idclient},
      date = ${date}, 
      note = ${note},
      fat = ${fat},
      height = ${height},
      weight = ${weight}
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