'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';
import { auth } from '@/app/lib/auth';
import { fetchUserById } from '@/app/query/users/data';


const FormSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: z.string(),
  idclinic: z.string(),
  avatarurl: z.string().optional(),
  category: z.string(),
  password: z.string().optional().nullable().or(z.literal('')), pronoun: z.string(),
});


const CreateUser = FormSchema.omit({ id: true });
const UpdateUser = FormSchema.omit({ id: true, idclinic: true });

export type State = {
  errors?: {
    name?: string[] | undefined;
    email?: string[] | undefined;
    role?: string[] | undefined;
    idclinic?: string[] | undefined;
    avatarurl?: string[] | undefined;
    category?: string[] | undefined;
    password?: string[] | undefined;
    pronoun?: string[] | undefined;
  };
  message?: string | undefined;
};

export async function createUser(prevState: State, formData: FormData) {

  const validatedFields = CreateUser.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    role: formData.get('role'),
    idclinic: formData.get('idclinic'),
    category: formData.get('category'),
    pronoun: formData.get('pronoun'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create.',
    };
  }
  const { name, email, role, idclinic, category, pronoun } = validatedFields.data;

  try {
    await sql`
        INSERT INTO smarthealth.users ( name, email, role, idclinic, category, pronoun)
        VALUES (${name}, ${email}, ${role}, ${idclinic}, ${category}, ${pronoun})
        `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create User.',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/auth/send-link`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    return {
      message: 'Erro ao enviar e-mail de autenticação.',
    };
  }
/*
  const data = await res.json();
  if (data.message && res.ok) {

    revalidatePath('/manager/users');
    redirect('/manager/users?success=Usuário criado com sucesso!');

    return {
      message: data.message,
    };
  }*/
  
  revalidatePath('/manager/users');
  //redirect('/manager/users');
  redirect('/manager/users?success=Usuário criado com sucesso!');

}

export async function updateUser(
  id: string,
  prevState: State,
  formData: FormData
) {
  const validatedFields = UpdateUser.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    role: formData.get('role'),
    category: formData.get('category'),
    pronoun: formData.get('pronoun'),
    avatarurl: formData.get('avatarurl'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update User.',
    };
  }
  const { name, email, role, avatarurl, category, pronoun, password } = validatedFields.data;
  const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

  try {
    if (!password) {
      await sql`
        UPDATE smarthealth.users
        SET name = ${name}, email = ${email}, role = ${role}, avatarurl = ${avatarurl}, category = ${category}, pronoun = ${pronoun}
        WHERE id = ${id}
      `;
    } else {
      await sql`
        UPDATE smarthealth.users
        SET name = ${name}, email = ${email}, role = ${role}, avatarurl = ${avatarurl}, category = ${category}, pronoun = ${pronoun}, password = ${hashedPassword}
        WHERE id = ${id}
      `;
    }

  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Update User.' };
  }

  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error('User session is not available.');
  }
  const user = await fetchUserById(session.user.id);

  if (user.role === 'Gerente') {
    revalidatePath('/manager/users');
    redirect('/manager/users');
  } else {
    revalidatePath('/dashboard');
    redirect('/dashboard');
  }
}

export async function deleteUser(id: string) {
  //throw new Error('Failed to Delete Invoice');

  await sql`DELETE FROM smarthealth.users WHERE id = ${id}`;
  revalidatePath('/manager/users');
}