'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { sql } from '@vercel/postgres';

const FormSchema = z.object({
  id: z.string(),
  cpf: z.string().optional(),
  name: z.string(),
  birth: z.string(),
  email: z.string().optional(),
  phone: z.string(),
  cep: z.string(),
  idclinic: z.string(),
  pronoun: z.string(),
});

const CreateClient = FormSchema.omit({ id: true });
const UpdateClient = FormSchema.omit({ id: true, idclinic: true });

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
  const validatedFields = CreateClient.safeParse({
    name: formData.get('name'),
    cpf: formData.get('cpf'),
    birth: formData.get('birth'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    cep: formData.get('cep'),
    idclinic: formData.get('idclinic'),
    pronoun: formData.get('pronoun'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create.',
    };
  }
  const { cpf, name, birth, email, phone, cep, idclinic, pronoun } = validatedFields.data;

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
    pronoun: formData.get('pronoun'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Client.',
    };
  }

  const { cpf, name, birth, email, phone, cep, pronoun } = validatedFields.data;
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
  redirect('/clients');

}