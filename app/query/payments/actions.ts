'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { sql } from '@vercel/postgres';

const FormSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  amount: z.string(),
  date: z.string(),
  idclinic: z.string(),
});

const CreatePayment = FormSchema.omit({ id: true });
const UpdatePayment = FormSchema.omit({ id: true, idclinic: true });

export type State = {
  message?: string;
  errors?: {
    date?: string[];
    title?: string[];
    description?: string[];
    amount?: string[];
  };
};

export async function createPayment(prevState: State, formData: FormData) {
  const validatedFields = CreatePayment.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    amount: formData.get('amount'),
    date: formData.get('date'),
    idclinic: formData.get('idclinic'),
  });
  //console.log(formData);
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create.',
    };
  }
  const { title, description, amount, date, idclinic } = validatedFields.data;
  const amountFormatted = amount.replace(/[^\d.,-]/g, '').replace(/\./g, '').replace(',', '.');

  try {
    await sql`
        INSERT INTO smarthealth.payments ( 
          title, description, amount, date, idclinic )
        VALUES (${title}, ${description}, ${amountFormatted}, ${date}, ${idclinic})
        `;
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to Create sayment.',
    };
  }
  revalidatePath('/manager/payments');
  redirect('/manager/payments');
}

export async function updatePayment(
  id: string,
  prevState: State,
  formData: FormData
) {
  //console.log(formData);
  const validatedFields = UpdatePayment.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    amount: formData.get('amount'),
    date: formData.get('date'),
  });


  if (!validatedFields.success) {
    console.error('Validation Error:', validatedFields.error);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update sayment.',
    };
  }

  const { title, description, amount, date } = validatedFields.data;
  const amountFormatted = amount.replace(/[^\d.,-]/g, '').replace(/\./g, '').replace(',', '.');

  try {
    await sql`
    UPDATE smarthealth.payments
    SET 
      title = ${title},
      description = ${description},
      amount = ${amountFormatted},
      date = ${date}
    WHERE id = ${id}
  `;
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Update Payment.' };
  }

  revalidatePath('/manager/payments');
  redirect('/manager/payments');
}

export async function deletePayment(id: string) {
  //throw new Error('Failed to Delete Invoice');

  await sql`DELETE FROM smarthealth.payments WHERE id = ${id}`;
  revalidatePath('/manager/payments');
}