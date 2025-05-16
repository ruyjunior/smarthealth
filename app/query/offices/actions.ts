'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

const FormSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
});

const CreateOffice = FormSchema.omit({ id: true });
const UpdateOffice = FormSchema.omit({ id: true });

export type State = {
  errors?: {
    title?: string[];
    description?: string[];
  };
  message?: string | null;
};

export async function createOffice(prevState: State, formData: FormData) {
  const validatedFields = CreateOffice.safeParse({
    title: formData.get('title'),
    description: formData.get('description')
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create.',
    };
  }
  const { title, description } = validatedFields.data;

  try {
    await sql`
      INSERT INTO smarthealth.offices (title, description)
      VALUES (${title}, ${description})
    `;
  } catch (error) {
    console.error('Error creating office:', error);
    return {
      message: 'Database Error: Failed to Create Office.',
    };
  }
  
  revalidatePath('/manager/offices');
  redirect('/manager/offices');
}

export async function updateOffice(
  id: string,
  prevState: State,
  formData: FormData
) {
  const validatedFields = UpdateOffice.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Office.',
    };
  }

  const { title, description } = validatedFields.data;

  try {
    await sql`
    UPDATE smarthealth.offices
    SET title = ${title}, description = ${description} 
    WHERE id = ${id}
  `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Office.' };
  }

  revalidatePath('/manager/offices');
  redirect('/manager/offices');
}

export async function deleteOffice(id: string) {
  //throw new Error('Failed to Delete Invoice');

  await sql`DELETE FROM smarthealth.offices WHERE id = ${id}`;
  revalidatePath('/manager/offices');
}