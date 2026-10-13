'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { sql } from '@vercel/postgres';
import { requireManagerClinicId } from '@/app/lib/session';

const FormSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  price: z.string(),
});

const TypeFields = FormSchema.omit({ id: true });

export type State = {
  errors?: {
    title?: string[];
    description?: string[];
    price?: string[];
  };
  message?: string | undefined;
};

export async function createType(prevState: State, formData: FormData) {
  const validatedFields = TypeFields.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    price: formData.get('price'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create.',
    };
  }
  const { title, description, price } = validatedFields.data;
  const idclinic = await requireManagerClinicId();
  const priceFormatted = price
    .replace(/[^\d.,-]/g, '')
    .replace(/\./g, '')
    .replace(',', '.');

  try {
    await sql`
        INSERT INTO smarthealth.types ( title, description, price, idclinic)
        VALUES (${title}, ${description}, ${priceFormatted}, ${idclinic})
        `;
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to Create Type.',
    };
  }
  revalidatePath('/manager/types');
  redirect('/manager/types');
}

export async function updateType(id: string, prevState: State, formData: FormData) {
  const validatedFields = TypeFields.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    price: formData.get('price'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Type.',
    };
  }

  const { title, description, price } = validatedFields.data;
  const priceFormatted = price
    .replace(/[^\d.,-]/g, '')
    .replace(/\./g, '')
    .replace(',', '.');
  const idclinic = await requireManagerClinicId();

  try {
    await sql`
    UPDATE smarthealth.types
    SET title = ${title}, description = ${description} , price = ${priceFormatted}
    WHERE id = ${id} AND idclinic = ${idclinic}
  `;
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Update Type.' };
  }

  revalidatePath('/manager/types');
  redirect('/manager/types');
}

export async function deleteType(id: string) {
  const idclinic = await requireManagerClinicId();

  await sql`DELETE FROM smarthealth.types WHERE id = ${id} AND idclinic = ${idclinic}`;
  revalidatePath('/manager/types');
}
