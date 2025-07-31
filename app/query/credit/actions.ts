'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { sql } from '@vercel/postgres';


const FormSchema = z.object({
  id: z.string(),
  email: z.string(),
});

const Update = FormSchema.omit({ id: true });

export type State = {
  errors?: {
    email?: string[] | null;
  };
  message?: string | null;
};

export async function update(
  id: string,
  prevState: State,
  formData: FormData
) {
  const validatedFields = Update.safeParse({
    email: formData.get('email'),
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update.',
    };
  }

  const { email } = validatedFields.data;

  try {
    await sql`
    UPDATE smarthealth.credits
    SET email = ${email}
    WHERE id = ${id}
  `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Clinic.' };
  }

  revalidatePath('/manager/account');
  redirect('/manager/account');
}