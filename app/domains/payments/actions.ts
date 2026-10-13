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
  amount: z.string(),
  date: z.string(),
});

const PaymentFields = FormSchema.omit({ id: true });

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
  const validatedFields = PaymentFields.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    amount: formData.get('amount'),
    date: formData.get('date'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create.',
    };
  }
  const { title, description, amount, date } = validatedFields.data;
  const amountFormatted = amount
    .replace(/[^\d.,-]/g, '')
    .replace(/\./g, '')
    .replace(',', '.');
  const idclinic = await requireManagerClinicId();

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

export async function updatePayment(id: string, prevState: State, formData: FormData) {
  const validatedFields = PaymentFields.safeParse({
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
  const amountFormatted = amount
    .replace(/[^\d.,-]/g, '')
    .replace(/\./g, '')
    .replace(',', '.');
  const idclinic = await requireManagerClinicId();

  try {
    await sql`
    UPDATE smarthealth.payments
    SET 
      title = ${title},
      description = ${description},
      amount = ${amountFormatted},
      date = ${date}
    WHERE id = ${id} AND idclinic = ${idclinic}
  `;
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Update Payment.' };
  }

  revalidatePath('/manager/payments');
  redirect('/manager/payments');
}

export async function deletePayment(id: string) {
  const idclinic = await requireManagerClinicId();

  await sql`DELETE FROM smarthealth.payments WHERE id = ${id} AND idclinic = ${idclinic}`;
  revalidatePath('/manager/payments');
}
