'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';
import { deleteUnusedFiles } from '@/app/lib/deleteUnusedFiles';
import { requireManagerClinicId, requireSessionUser } from '@/app/lib/session';
import { fetchUserById } from '@/app/domains/users/queries';
import { MANAGER_ROLE, USER_ROLES, isManager } from '@/app/lib/roles';

const FormSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: z.enum(USER_ROLES),
  avatarurl: z.string().optional(),
  category: z.string(),
  password: z.string().optional().nullable().or(z.literal('')),
  pronoun: z.string(),
});

const UserFields = FormSchema.omit({ id: true });

export type State = {
  errors?: {
    name?: string[] | undefined;
    email?: string[] | undefined;
    role?: string[] | undefined;
    avatarurl?: string[] | undefined;
    category?: string[] | undefined;
    password?: string[] | undefined;
    pronoun?: string[] | undefined;
  };
  message?: string | undefined;
};

export async function createUser(prevState: State, formData: FormData) {
  const validatedFields = UserFields.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    role: formData.get('role'),
    category: formData.get('category'),
    pronoun: formData.get('pronoun'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create.',
    };
  }
  const { name, email, role, category, pronoun } = validatedFields.data;
  const idclinic = await requireManagerClinicId();

  try {
    await sql`
        INSERT INTO smarthealth.users ( name, email, role, idclinic, category, pronoun)
        VALUES (${name}, ${email}, ${role}, ${idclinic}, ${category}, ${pronoun})
        `;
  } catch {
    return {
      message: 'Database Error: Failed to Create User.',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const res = await fetch(`${baseUrl}/api/auth/send-link`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    return {
      message: 'Erro ao enviar e-mail de autenticação.',
    };
  }

  deleteUnusedFiles();

  revalidatePath('/manager/users');
  redirect('/manager/users?success=Usuario criado com sucesso!');
}

export async function updateUser(id: string, prevState: State, formData: FormData) {
  const validatedFields = UserFields.safeParse({
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

  const actor = await requireSessionUser();
  const idclinic = actor.idclinic;

  const target = await fetchUserById(idclinic, id);

  if (!target) {
    return {
      message: 'Usuário não encontrado nesta clínica.',
    };
  }

  const { name, email, avatarurl, category, pronoun, password } = validatedFields.data;
  // only a manager may change a role; everyone else keeps the stored one
  const role = isManager(actor.role) ? validatedFields.data.role : target.role;
  const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

  try {
    if (!password) {
      await sql`
        UPDATE smarthealth.users
        SET name = ${name}, email = ${email}, role = ${role}, avatarurl = ${avatarurl}, category = ${category}, pronoun = ${pronoun}
        WHERE id = ${id} AND idclinic = ${idclinic}
      `;
    } else {
      await sql`
        UPDATE smarthealth.users
        SET name = ${name}, email = ${email}, role = ${role}, avatarurl = ${avatarurl}, category = ${category}, pronoun = ${pronoun}, password = ${hashedPassword}
        WHERE id = ${id} AND idclinic = ${idclinic}
      `;
    }
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Update User.' };
  }

  deleteUnusedFiles();

  if (isManager(actor.role)) {
    revalidatePath('/manager/users');
    redirect('/manager/users');
  } else {
    revalidatePath('/dashboard');
    redirect('/dashboard');
  }
}

export async function deleteUser(id: string) {
  const idclinic = await requireManagerClinicId();

  await sql`
    DELETE FROM smarthealth.users
    WHERE id = ${id} AND idclinic = ${idclinic} AND role <> ${MANAGER_ROLE}
  `;
  deleteUnusedFiles();

  revalidatePath('/manager/users');
}
