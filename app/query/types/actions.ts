'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { sql } from '@vercel/postgres';

const FormSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  price: z.string(),
  idclinic: z.string(),
});

const CreateType = FormSchema.omit({ id: true });
const UpdateType = FormSchema.omit({ id: true, idclinic: true });

export type State = {
  errors?: {
    title?: string[];
    description?: string[];
    price?: string[];
  };
  message?: string | undefined;
};

export async function createType(prevState: State, formData: FormData) {
  const validatedFields = CreateType.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    price: formData.get('price'),
    idclinic: formData.get('idclinic')
  });
  //console.log('validatedFields', validatedFields);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create.',
    };
  }
  const { title, description, price, idclinic } = validatedFields.data;
  const priceFormatted = price.replace(',', '.');

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

export async function updateType(
  id: string,
  prevState: State,
  formData: FormData
) {
  const validatedFields = UpdateType.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    price: formData.get('price')
  });
  //console.log('validatedFields', validatedFields);


  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Type.',
    };
  }

  const { title, description, price } = validatedFields.data;
  const priceFormatted = price.replace(',', '.');

  try {
    await sql`
    UPDATE smarthealth.types
    SET title = ${title}, description = ${description} , price = ${priceFormatted}
    WHERE id = ${id}
  `;
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Update Type.' };
  }

  revalidatePath('/manager/types');
  redirect('/manager/types');
}

export async function deleteType(id: string) {
  //throw new Error('Failed to Delete Invoice');

  await sql`DELETE FROM smarthealth.types WHERE id = ${id}`;
  revalidatePath('/manager/types');
}