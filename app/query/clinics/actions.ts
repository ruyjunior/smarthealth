'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';
import { log } from 'console';
import { deleteUnusedFiles } from '@/app/lib/deleteUnusedFiles';


const FormSchema = z.object({
  id: z.string(),
  title: z.string(),
  idmanager: z.string().optional(),
  logourl: z.string().optional(),
  siteurl: z.string().optional(),
  cnpj: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
});

const CreateClinic = FormSchema.omit({ id: true });
const UpdateClinic = FormSchema.omit({ id: true, idmanager: true });

export type State = {
  errors?: {
    title?: string[];
    logourl?: string[] | null;
    siteurl?: string[] | null;
    cnpj?: string[] | null;
    address?: string[] | null;
    phone?: string[] | null;
  };
  message?: string | null;
};

export async function createClinic(prevState: State, formData: FormData) {
  const validatedFields = CreateClinic.safeParse({
    title: formData.get('title'),
    idmanager: formData.get('idmanager'),
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
  deleteUnusedFiles();


  revalidatePath('/manager/clinics');
  redirect('/manager/clinics');
}

export async function updateClinic(
  id: string,
  prevState: State,
  formData: FormData
) {
  const validatedFields = UpdateClinic.safeParse({
    title: formData.get('title'),
    logourl: formData.get('logourl'),
    siteurl: formData.get('siteurl'),
    cnpj: formData.get('cnpj'),
    address: formData.get('address'),
    phone: formData.get('phone')
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Clinic.',
    };
  }

  const { title, logourl, siteurl, cnpj, address, phone } = validatedFields.data;

  try {
    await sql`
    UPDATE smarthealth.clinics
    SET title = ${title}, logourl = ${logourl}, siteurl = ${siteurl}, cnpj = ${cnpj}, address = ${address}, phone = ${phone}
    WHERE id = ${id}
  `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Clinic.' };
  }

  deleteUnusedFiles();
  revalidatePath('/manager/clinics');
  redirect('/manager/clinics');
}

export async function deleteClinic(id: string) {
  //throw new Error('Failed to Delete Invoice');
  deleteUnusedFiles();

  await sql`DELETE FROM smarthealth.clinics WHERE id = ${id}`;
  revalidatePath('/manager/clinics');
}