'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

const FormSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
  role: z.string(),
  idclinic: z.string(),
});


const CreateUser = FormSchema.omit({ id: true });
const UpdateUser = FormSchema.omit({ id: true, idclinic: true });

export type State = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    role?: string[];
    idclinic?: string[];
  };
  message?: string | null;
};

export async function createUser(prevState: State, formData: FormData) {
  const validatedFields = CreateUser.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    role: formData.get('role'),
    idclinic: formData.get('idclinic'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create.',
    };
  }
  const { name, email, password, role, idclinic } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await sql`
        INSERT INTO smarthealth.users ( name, email, password, role, idclinic)
        VALUES (${name}, ${email}, ${hashedPassword}, ${role}, ${idclinic})
        `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create User.',
    };
  }
  revalidatePath('/manager/users');
  redirect('/manager/users');
}

export async function updateUser(
  id: string,
  prevState: State,
  formData: FormData
) {

  const validatedFields = UpdateUser.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    role: formData.get('role'),
  });
  //console.log('validatedFields', validatedFields);
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update User.',
    };
  }
  //console.log('validatedFields', validatedFields);
  const { name, email, password, role } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      //console.log('Senha' + password);
      //console.log('Senha Criptografada' + hashedPassword);

      await sql`
        UPDATE smarthealth.users
        SET name = ${name}, email = ${email}, password = ${hashedPassword}, role = ${role}
        WHERE id = ${id}
      `;
    } else {
      //console.log(password);

      await sql`
        UPDATE smarthealth.users
        SET name = ${name}, email = ${email}, role = ${role}
        WHERE id = ${id}
      `;
    }
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Update User.' };
  }

  revalidatePath('/manager/users');
  redirect('/manager/users');
}

export async function deleteUser(id: string) {
  //throw new Error('Failed to Delete Invoice');

  await sql`DELETE FROM smarthealth.users WHERE id = ${id}`;
  revalidatePath('/manager/users');
}