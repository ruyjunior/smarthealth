'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { sql } from '@vercel/postgres';
import { getCurrentClinicId } from '@/app/lib/session';

const FormSchema = z.object({
  id: z.string(),
  cpf: z.string().optional(),
  name: z.string(),
  birth: z.string(),
  email: z.string().optional(),
  phone: z.string(),
  cep: z.string(),
  pronoun: z.string(),
});

const ClientFields = FormSchema.omit({ id: true });

export type State = {
  errors?: {
    cpf?: string[];
    name?: string[];
    birth?: string[];
    email?: string[];
    phone?: string[];
    cep?: string[];
    pronoun?: string[];
  };
  message?: string | null;
};

export async function createClient(prevState: State, formData: FormData) {
  const validatedFields = ClientFields.safeParse({
    name: formData.get('name'),
    cpf: formData.get('cpf'),
    birth: formData.get('birth'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    cep: formData.get('cep'),
    pronoun: formData.get('pronoun'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create.',
    };
  }
  const { cpf, name, birth, email, phone, cep, pronoun } = validatedFields.data;
  const idclinic = await getCurrentClinicId();

  const sanetizedCPF = cpf || null;
  const sanetizedEmail = email || null;
  const sanetizedPhone = phone || null;
  const sanetizedCEP = cep || null;
  const sanetizedBirth = birth || null;

  try {
    await sql`
        INSERT INTO smarthealth.clients ( cpf, name, birth, 
        email, phone, cep, idclinic, pronoun)
        VALUES ( ${sanetizedCPF}, ${name}, ${sanetizedBirth}, ${sanetizedEmail}, ${sanetizedPhone}, 
        ${sanetizedCEP}, ${idclinic}, ${pronoun})
        `;
  } catch (error) {
    console.error('Database Error:', error);

    return {
      message: 'Database Error: Failed to Create Client.',
    };
  }
  revalidatePath('/clients');
  redirect('/clients');
}

export async function updateClient(id: string, prevState: State, formData: FormData) {
  const validatedFields = ClientFields.safeParse({
    cpf: formData.get('cpf'),
    name: formData.get('name'),
    birth: formData.get('birth'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    cep: formData.get('cep'),
    pronoun: formData.get('pronoun'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Client.',
    };
  }

  const { cpf, name, birth, email, phone, cep, pronoun } = validatedFields.data;
  const idclinic = await getCurrentClinicId();
  const sanetizedCPF = cpf || null;
  const sanetizedEmail = email || null;
  const sanetizedPhone = phone || null;
  const sanetizedCEP = cep || null;
  const sanetizedBirth = birth || null;

  try {
    await sql`
    UPDATE smarthealth.clients
    SET cpf = ${sanetizedCPF}, name = ${name}, birth = ${sanetizedBirth},
        email = ${sanetizedEmail}, phone = ${sanetizedPhone}, cep = ${sanetizedCEP}, pronoun = ${pronoun}
    WHERE id = ${id} AND idclinic = ${idclinic}
  `;
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Update Client.' };
  }

  revalidatePath('/clients');
  redirect('/clients');
}

export async function deleteClient(id: string) {
  const idclinic = await getCurrentClinicId();

  await sql`DELETE FROM smarthealth.clients WHERE id = ${id} AND idclinic = ${idclinic}`;
  revalidatePath('/clients');
  redirect('/clients');
}
