'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';
import { log } from 'console';

const FormSchema = z.object({
  id: z.string(),
  title: z.string(),
  idmanager: z.string(),
  logourl: z.string().optional(),
});

const CreateClinic = FormSchema.omit({ id: true });
const UpdateClinic = FormSchema.omit({ id: true, idmanager: true });

export type State = {
  errors?: {
    title?: string[];
    logourl?: string[] | null;
  };
  message?: string | null;
};

export async function createClinic(prevState: State, formData: FormData) {
  const validatedFields = CreateClinic.safeParse({
    title: formData.get('title'),
    idmanager: formData.get('idmanager')
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create.',
    };
  }
  const { title, idmanager } = validatedFields.data;

  try {
    await sql`
      INSERT INTO smarthealth.clinics (title, idmanager)
      VALUES (${title}, ${idmanager})
    `;
  } catch (error) {
    console.error('Error creating clinic:', error);
    return {
      message: 'Database Error: Failed to Create Clinic.',
    };
  }

  revalidatePath('/manager/clinics');
  redirect('/manager/clinics');
}

export async function updateClinic(
  id: string,
  prevState: State,
  formData: FormData
) {
  //console.log('Clinic formData' + formData.values);
  const validatedFields = UpdateClinic.safeParse({
    title: formData.get('title'),
    logourl: formData.get('logourl'),
  });
  console.log('Clinic formData: ' + validatedFields.data?.logourl);
  console.log('Clinic formData: ' + validatedFields.data?.title);
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Clinic.',
    };
  }

  const { title, logourl } = validatedFields.data;

  try {
    await sql`
    UPDATE smarthealth.clinics
    SET title = ${title}, logourl = ${logourl}
    WHERE id = ${id}
  `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Clinic.' };
  }

  revalidatePath('/manager/clinics');
  redirect('/manager/clinics');
}

export async function deleteClinic(id: string) {
  //throw new Error('Failed to Delete Invoice');

  await sql`DELETE FROM smarthealth.clinics WHERE id = ${id}`;
  revalidatePath('/manager/clinics');
}