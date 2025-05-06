'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { sql } from '@vercel/postgres';

const FormSchema = z.object({
  id: z.string(),
  iduser: z.string(),
  idoffice: z.string(),
  idclient: z.string(),
  idtype: z.string(),
  status: z.string(),
  date: z.string(),
  starttime: z.string(),
  endtime: z.string(),
});

const CreateService = FormSchema.omit({ id: true });
const UpdateService = FormSchema.omit({ id: true });

export type State = {
  message?: string;
  errors?: {
    iduser?: string[];
    idoffice?: string[];
    idclient?: string[];
    idtype?: string[];
    status?: string[];
    date?: string[];
    starttime?: string[];
    endtime?: string[];
  };
};

export async function createService(prevState: State, formData: FormData) {
  const validatedFields = CreateService.safeParse({
    iduser: formData.get('iduser'),
    idoffice: formData.get('idoffice'),
    idclient: formData.get('idclient'),
    idtype: formData.get('idtype'),
    status: formData.get('status'),
    date: formData.get('date'),
    starttime: formData.get('starttime'),
    endtime: formData.get('endtime'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create.',
    };
  }
  const { iduser, idoffice, idclient, idtype, status, date, starttime, endtime } = validatedFields.data;

  try {
    await sql`
        INSERT INTO smarthealth.services ( 
          iduser, idoffice, idclient, idtype, status, date, starttime, endtime )
        VALUES (${iduser}, ${idoffice}, ${idclient}, ${idtype}, ${status}, ${date}, ${starttime}, ${endtime})
        `;
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to Create service.',
    };
  }
  revalidatePath('/services');
  redirect('/services');
}

export async function updateService(
  id: string,
  prevState: State,
  formData: FormData
) {

  const validatedFields = UpdateService.safeParse({
    iduser: formData.get('iduser'),
    idoffice: formData.get('idoffice'),
    idclient: formData.get('idclient'),
    idtype: formData.get('idtype'),
    status: formData.get('status'),
    date: formData.get('date'),
    starttime: formData.get('starttime'),
    endtime: formData.get('endtime'),
  });


  if (!validatedFields.success) {
    console.log('Error: ', validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update service.',
    };
  }

  const { iduser, idoffice, idclient, idtype, status, date, starttime, endtime } = validatedFields.data;
  const sanitizedEndDate = date || null;
  const sanitizedStartTime = starttime || null;
  const sanitizedEndTime = endtime || null;

  try {
    await sql`
    UPDATE smarthealth.services
    SET 
      iduser = ${iduser},
      idoffice = ${idoffice},
      idclient = ${idclient},
      idtype = ${idtype},
      status = ${status},
      date = ${date}, 
      starttime = ${sanitizedStartTime},
      endtime = ${sanitizedEndTime}
    WHERE id = ${id}
  `;
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Update service.' };
  }

  revalidatePath('/services');
  redirect('/services/');
}

export async function deleteService(id: string) {
  //throw new Error('Failed to Delete Invoice');

  await sql`DELETE FROM smarthealth.services WHERE id = ${id}`;
  revalidatePath('/services');
}