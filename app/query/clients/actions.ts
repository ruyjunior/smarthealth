'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { sql } from '@vercel/postgres';

const FormSchema = z.object({
  id: z.string(),
  cpf: z.string(),
  name: z.string(),
  birth: z.string(),
  email: z.string(),
  phone: z.string(),
  cep: z.string(),
});

const CreateClient = FormSchema.omit({ id: true });
const UpdateClient = FormSchema.omit({ id: true });

export type State = {
  errors?: {
    cpf?: string[];
    name?: string[];
    birth?: string[];
    email?: string[];
    phone?: string[];
    cep?: string[];
  };
  message?: string | null;
};

export async function createClient(prevState: State, formData: FormData) {
  const validatedFields = CreateClient.safeParse({
    cpf: formData.get('cpf'),
    name: formData.get('name'),
    birth: formData.get('birth'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    cep: formData.get('cep'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create.',
    };
  }
  const { cpf, name, birth, email, phone, cep } = validatedFields.data;

  try {
    await sql`
        INSERT INTO smarthealth.clients ( cpf, name, birth, 
        email, phone, cep)
        VALUES ( ${cpf}, ${name}, ${birth}, ${email}, ${phone}, 
        ${cep})
        `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Client.',
    };
  }
  revalidatePath('/clients');
  redirect('/clients');
}

export async function updateClient(
  id: string,
  prevState: State,
  formData: FormData
) {
  
  const validatedFields = UpdateClient.safeParse({
    cpf: formData.get('cpf'),
    name: formData.get('name'),
    birth: formData.get('birth'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    cep: formData.get('cep'),
  });
  
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Client.',
    };
  }

  const { cpf, name, birth, email, phone, cep } = validatedFields.data;

  try {
    await sql`
    UPDATE smarthealth.clients
    SET cpf = ${cpf}, name = ${name}, birth = ${birth},
        email = ${email}, phone = ${phone}, cep = ${cep}
    WHERE id = ${id}
  `;
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Update Client.' };
  }

  revalidatePath('/clients');
  redirect('/clients');
}

export async function deleteClient(id: string) {
  //throw new Error('Failed to Delete Invoice');

  await sql`DELETE FROM smarthealth.clients WHERE id = ${id}`;
  revalidatePath('/clients');
}