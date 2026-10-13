'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { sql } from '@vercel/postgres';
import { deleteUnusedFiles } from '@/app/lib/deleteUnusedFiles';
import { requireManagerClinicId } from '@/app/lib/session';

const FormSchema = z.object({
  id: z.string(),
  title: z.string(),
  logourl: z.string().optional(),
  siteurl: z.string().optional(),
  cnpj: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
});

const ClinicFields = FormSchema.omit({ id: true });

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

export async function updateClinic(id: string, prevState: State, formData: FormData) {
  const validatedFields = ClinicFields.safeParse({
    title: formData.get('title'),
    logourl: formData.get('logourl'),
    siteurl: formData.get('siteurl'),
    cnpj: formData.get('cnpj'),
    address: formData.get('address'),
    phone: formData.get('phone'),
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Clinic.',
    };
  }

  const { title, logourl, siteurl, cnpj, address, phone } = validatedFields.data;
  const idclinic = await requireManagerClinicId();

  try {
    await sql`
    UPDATE smarthealth.clinics
    SET title = ${title}, logourl = ${logourl}, siteurl = ${siteurl}, cnpj = ${cnpj}, address = ${address}, phone = ${phone}
    WHERE id = ${id} AND id = ${idclinic}
  `;
  } catch {
    return { message: 'Database Error: Failed to Update Clinic.' };
  }

  deleteUnusedFiles();
  revalidatePath('/manager/clinics');
  redirect('/manager/clinics');
}

export async function deleteClinic(id: string) {
  const idclinic = await requireManagerClinicId();

  await sql`DELETE FROM smarthealth.clinics WHERE id = ${id} AND id = ${idclinic}`;
  deleteUnusedFiles();
  revalidatePath('/manager/clinics');
}
