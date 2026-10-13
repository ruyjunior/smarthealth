'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { sql } from '@vercel/postgres';
import { SERVICE_STATUSES } from './types';
import { getCurrentClinicId } from '@/app/lib/session';

const FormSchema = z.object({
  id: z.string(),
  iduser: z.string(),
  idoffice: z.string(),
  idclient: z.string(),
  idtype: z.string(),
  status: z.enum(SERVICE_STATUSES),
  date: z.string(),
  starttime: z.string(),
  endtime: z.string(),
});

const ServiceFields = FormSchema.omit({ id: true });

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
  const validatedFields = ServiceFields.safeParse({
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
  const { iduser, idoffice, idclient, idtype, status, date, starttime, endtime } =
    validatedFields.data;
  const idclinic = await getCurrentClinicId();

  try {
    const inserted = await sql`
        INSERT INTO smarthealth.services ( 
          iduser, idoffice, idclient, idtype, status, date, starttime, endtime, idclinic )
        SELECT ${iduser}, ${idoffice}, ${idclient}, ${idtype}, ${status}, ${date}, ${starttime}, ${endtime}, ${idclinic}
        WHERE
          EXISTS (SELECT 1 FROM smarthealth.clients WHERE id = ${idclient} AND idclinic = ${idclinic}) AND
          EXISTS (SELECT 1 FROM smarthealth.offices WHERE id = ${idoffice} AND idclinic = ${idclinic}) AND
          EXISTS (SELECT 1 FROM smarthealth.types WHERE id = ${idtype} AND idclinic = ${idclinic}) AND
          EXISTS (SELECT 1 FROM smarthealth.users WHERE id = ${iduser} AND idclinic = ${idclinic})
        RETURNING id
        `;

    if (inserted.rowCount === 0) {
      return {
        message: 'Paciente, profissional, consultório ou tipo não pertencem a esta clínica.',
      };
    }
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to Create service.',
    };
  }
  revalidatePath('/services');
  redirect('/services');
}

export async function updateService(id: string, prevState: State, formData: FormData) {
  const validatedFields = ServiceFields.safeParse({
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
      message: 'Missing Fields. Failed to Update service.',
    };
  }

  const { iduser, idoffice, idclient, idtype, status, date, starttime, endtime } =
    validatedFields.data;
  const sanitizedStartTime = starttime || null;
  const sanitizedEndTime = endtime || null;
  const idclinic = await getCurrentClinicId();

  try {
    const updated = await sql`
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
    WHERE id = ${id} AND idclinic = ${idclinic}
      AND EXISTS (SELECT 1 FROM smarthealth.clients WHERE id = ${idclient} AND idclinic = ${idclinic})
      AND EXISTS (SELECT 1 FROM smarthealth.offices WHERE id = ${idoffice} AND idclinic = ${idclinic})
      AND EXISTS (SELECT 1 FROM smarthealth.types WHERE id = ${idtype} AND idclinic = ${idclinic})
      AND EXISTS (SELECT 1 FROM smarthealth.users WHERE id = ${iduser} AND idclinic = ${idclinic})
  `;

    if (updated.rowCount === 0) {
      return {
        message: 'Atendimento não encontrado ou vínculos de outra clínica.',
      };
    }
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Update service.' };
  }

  revalidatePath('/services');
  redirect('/services/');
}

export async function deleteService(id: string) {
  const idclinic = await getCurrentClinicId();

  await sql`DELETE FROM smarthealth.services WHERE id = ${id} AND idclinic = ${idclinic}`;
  revalidatePath('/services');
}
