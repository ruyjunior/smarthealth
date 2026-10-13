'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { sql } from '@vercel/postgres';
import { toPgArray } from '@/app/lib/utils';
import { requireManagerClinicId } from '@/app/lib/session';

const FormSchema = z.object({
  id: z.string(),
  title: z.string(),
  fieldslabels: z.array(z.string()),
  checkslabels: z.array(z.string()),
});

const NoteTypeFields = FormSchema.omit({ id: true });

export type State = {
  message?: string | null;
  errors?: {
    title?: string[];
    fieldslabels?: string[];
    checkslabels?: string[];
  };
};

export async function createNoteType(prevState: State, formData: FormData) {
  const validatedFields = NoteTypeFields.safeParse({
    title: formData.get('title'),
    fieldslabels: ((formData.get('fieldslabels') as string) || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    checkslabels: ((formData.get('checkslabels') as string) || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create.',
    };
  }

  const { title, fieldslabels, checkslabels } = validatedFields.data;
  const idclinic = await requireManagerClinicId();

  try {
    await sql`
        INSERT INTO smarthealth.notetypes ( 
          idclinic, title, fieldslabels, checkslabels
        )
        VALUES (${idclinic}, ${title}, ${toPgArray(fieldslabels)}, ${toPgArray(checkslabels)})
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

export async function updateNoteType(id: string, prevState: State, formData: FormData) {
  const validatedFields = NoteTypeFields.safeParse({
    title: formData.get('title'),
    fieldslabels: ((formData.get('fieldslabels') as string) || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    checkslabels: ((formData.get('checkslabels') as string) || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Notetypes.',
    };
  }

  const { title, fieldslabels, checkslabels } = validatedFields.data;
  const idclinic = await requireManagerClinicId();

  try {
    await sql`
    UPDATE smarthealth.notetypes
    SET 
      title = ${title},
      fieldslabels = ${toPgArray(fieldslabels)},
      checkslabels = ${toPgArray(checkslabels)}
    WHERE id = ${id} AND idclinic = ${idclinic}
  `;
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Update Notetypes.' };
  }

  revalidatePath('/manager/notetypes');
  redirect('/manager/notetypes');
}

export async function deleteNoteType(id: string) {
  const idclinic = await requireManagerClinicId();

  await sql`DELETE FROM smarthealth.notetypes WHERE id = ${id} AND idclinic = ${idclinic}`;
  revalidatePath('/manager/notetypes');
}
