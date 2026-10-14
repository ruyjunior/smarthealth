'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { sql } from '@vercel/postgres';
import {
  DEVICE_KINDS,
  DEVICE_PAIRING_PATH,
  PAIRING_CODE_TTL_MINUTES,
  deviceHomePath,
  type DeviceKind,
} from '@/app/lib/device';
import {
  createPairingCode,
  hashPairingCode,
  pairDeviceWithCode,
  unpairDevice,
} from '@/app/lib/device-session';
import { requireManagerClinicId } from '@/app/lib/session';

const DeviceFields = z.object({
  label: z.string().min(1),
  kind: z.enum(DEVICE_KINDS),
});

export type State = {
  message?: string;
  errors?: {
    label?: string[];
    kind?: string[];
  };
  created?: {
    id: string;
    label: string;
    kind: DeviceKind;
    /** Código curto, exibido uma única vez (só o hash dele é persistido). */
    pairingCode: string;
    expiresInMinutes: number;
  };
};

export type PairState = {
  message?: string;
};

export type PairingCodeResult = {
  pairingCode?: string;
  expiresInMinutes?: number;
  message?: string;
};

export async function createDevice(prevState: State, formData: FormData) {
  const idclinic = await requireManagerClinicId();

  const validatedFields = DeviceFields.safeParse({
    label: formData.get('label'),
    kind: formData.get('kind'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Campos inválidos. Falha ao criar dispositivo.',
    };
  }

  const { label, kind } = validatedFields.data;
  // O código em texto claro não é persistido: só o hash vai para o banco, então
  // esta é a única chance de a UI exibi-lo para quem pareia o dispositivo.
  const pairingCode = createPairingCode();

  try {
    const inserted = await sql<{ id: string; label: string; kind: DeviceKind }>`
      INSERT INTO smarthealth.devices (
        idclinic, label, kind, pairingcodehash, pairingexpiresat )
      VALUES (
        ${idclinic}, ${label}, ${kind}, ${hashPairingCode(pairingCode)},
        now() + make_interval(mins => ${PAIRING_CODE_TTL_MINUTES}::int) )
      RETURNING id, label, kind
    `;

    const device = inserted.rows[0];
    revalidatePath('/manager/devices');

    return {
      created: {
        id: device.id,
        label: device.label,
        kind: device.kind,
        pairingCode,
        expiresInMinutes: PAIRING_CODE_TTL_MINUTES,
      },
    };
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to create device.' };
  }
}

/** Emite um código novo para um dispositivo sem sessão (código expirado ou perdido). */
export async function regeneratePairingCode(id: string): Promise<PairingCodeResult> {
  const idclinic = await requireManagerClinicId();
  const pairingCode = createPairingCode();

  try {
    const updated = await sql<{ id: string }>`
      UPDATE smarthealth.devices
      SET pairingcodehash = ${hashPairingCode(pairingCode)},
          pairingexpiresat = now() + make_interval(mins => ${PAIRING_CODE_TTL_MINUTES}::int)
      WHERE id = ${id} AND idclinic = ${idclinic} AND revokedat IS NULL
      RETURNING id
    `;

    if (updated.rowCount === 0) {
      return { message: 'Dispositivo não encontrado ou revogado.' };
    }
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to generate pairing code.' };
  }

  revalidatePath('/manager/devices');

  return { pairingCode, expiresInMinutes: PAIRING_CODE_TTL_MINUTES };
}

/** Keeps the row (and its audit trail) but stops the device from resolving a session. */
export async function revokeDevice(id: string) {
  const idclinic = await requireManagerClinicId();

  await sql`
    UPDATE smarthealth.devices
    SET revokedat = now()
    WHERE id = ${id} AND idclinic = ${idclinic}
  `;

  revalidatePath('/manager/devices');
}

export async function deleteDevice(id: string) {
  const idclinic = await requireManagerClinicId();

  await sql`DELETE FROM smarthealth.devices WHERE id = ${id} AND idclinic = ${idclinic}`;

  revalidatePath('/manager/devices');
}

/*
 * As duas actions abaixo são as únicas públicas do módulo de dispositivos: um
 * totem ainda não pareado não tem sessão nem login, e é o código que ele troca
 * aqui que passa a identificar a clínica. Não há SQL nelas de propósito — quem
 * resolve o dispositivo a partir do código é `app/lib/device-session.ts`.
 */

export async function pairDevice(prevState: PairState, formData: FormData) {
  const parsed = z.string().trim().min(1).safeParse(formData.get('code'));

  if (!parsed.success) {
    return { message: 'Informe o código de pareamento.' };
  }

  const device = await pairDeviceWithCode(parsed.data);

  if (!device) {
    return { message: 'Código inválido ou expirado. Peça um código novo na gerência.' };
  }

  // Cada tipo tem a sua tela: mandar um telão para `/totem` só produziria vaivém.
  redirect(deviceHomePath(device.kind) ?? DEVICE_PAIRING_PATH);
}

export async function unpairDeviceAction() {
  await unpairDevice();

  redirect(DEVICE_PAIRING_PATH);
}
