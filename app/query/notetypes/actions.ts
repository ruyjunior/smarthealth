'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { sql } from '@vercel/postgres';
import { toPgArray } from '@/app/lib/utils';

const FormSchema = z.object({
  id: z.string(),
  idclinic: z.string(),
  title: z.string(),
  fieldsnumber: z.string(),
  checksnumber: z.string(),
  fieldslabels: z.array(z.string()),
  checkslabels: z.array(z.string()),
});

const CreateNoteType = FormSchema.omit({ id: true });
const UpdateNoteType = FormSchema.omit({ id: true, idclinic: true });

export type State = {
  message?: string | null;
  errors?: {
    title?: string[];
    fieldsnumber?: string[];
    checksnumber?: string[];
    fieldslabels?: string[];
    checkslabels?: string[];
  };
};

export async function createNoteType(prevState: State, formData: FormData) {
  console.log('Form Data: ', formData);
  const validatedFields = CreateNoteType.safeParse({
    idclinic: formData.get('idclinic'),
    title: formData.get('title'),
    fieldsnumber: formData.get('fieldsnumber'),
    checksnumber: formData.get('checksnumber'),
    fieldslabels: (formData.get('fieldslabels') as string || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean),
    checkslabels: (formData.get('checkslabels') as string || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean),
  });
  console.log('Validated Fields: ', validatedFields.success);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create.',
    };
  }

  const { idclinic, title, fieldsnumber, checksnumber, fieldslabels, checkslabels } = validatedFields.data;

  try {
    await sql`
        INSERT INTO smarthealth.notetypes ( 
          idclinic, title, fieldsnumber, checksnumber, fieldslabels, checkslabels
        )
        VALUES (${idclinic}, ${title}, ${fieldsnumber}, ${checksnumber}, ${toPgArray(fieldslabels)}, ${toPgArray(checkslabels)})
        `;
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to Create Notetypes.',
    };
  }
  revalidatePath('/manager/notetypes');
  redirect('/manager/notetypes');
}

export async function updateNoteType(
  id: string,
  prevState: State,
  formData: FormData
) {

  const validatedFields = UpdateNoteType.safeParse({
    idclinic: formData.get('idclinic'),
    title: formData.get('title'),
    fieldsnumber: formData.get('fieldsnumber'),
    checksnumber: formData.get('checksnumber'),
    fieldslabels: (formData.get('fieldslabels') as string || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean),
    checkslabels: (formData.get('checkslabels') as string || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean),
  });


  if (!validatedFields.success) {
    console.log('Error: ', validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Notetypes.',
    };
  }

  const { title, fieldsnumber, checksnumber, fieldslabels, checkslabels } = validatedFields.data;

  try {
    await sql`
    UPDATE smarthealth.notetypes
    SET 
      title = ${title},
      fieldsnumber = ${fieldsnumber},
      checksnumber = ${checksnumber},
      fieldslabels = ${toPgArray(fieldslabels)},
      checkslabels = ${toPgArray(checkslabels)}
    WHERE id = ${id}
  `;
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Update Notetypes.' };
  }

  revalidatePath('/manager/notetypes');
  redirect('/manager/notetypes');
}

export async function deleteNoteType(id: string) {
  //throw new Error('Failed to Delete Invoice');

  await sql`DELETE FROM smarthealth.notetypes WHERE id = ${id}`;
  revalidatePath('/manager/notetypes');
}