import { cache } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { randomBytes, randomInt, createHash } from 'node:crypto';
import { sql } from '@vercel/postgres';
import {
  DEVICE_PAIRING_PATH,
  PAIRING_CODE_ALPHABET,
  PAIRING_CODE_LENGTH,
  formatPairingCode,
  isValidPairingCodeFormat,
  normalizePairingCode,
  type DeviceKind,
} from '@/app/lib/device';

/**
 * Session of a paired device (totem or telão).
 *
 * Unlike every other query in this app, the lookup below is intentionally
 * cross-tenant: the token stored in the cookie is what IDENTIFIES the clinic, so
 * there is no `idclinic` to filter by — the clinic comes from the device row,
 * never from the request. Only the SHA-256 of the token is stored, so a database
 * leak cannot be replayed as a device credential.
 *
 * `pairDeviceWithToken` is the only writer of the cookie and therefore can only
 * be called from a Server Action or a Route Handler (`cookies().set` throws
 * during a plain render).
 */
export const DEVICE_COOKIE = 'sh_device';

/** 32 random bytes as base64url: 43 URL-safe characters, the size of a session secret. */
export function createDeviceToken(): string {
  return randomBytes(32).toString('base64url');
}

export function hashDeviceToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/** Código curto para digitar na TV, já formatado (`K7M4-2QP9`). */
export function createPairingCode(): string {
  // `randomInt` evita o viés de módulo de um `%` sobre bytes aleatórios, e o
  // alfabeto tem 31 símbolos — que não é potência de dois.
  const code = Array.from(
    { length: PAIRING_CODE_LENGTH },
    () => PAIRING_CODE_ALPHABET[randomInt(PAIRING_CODE_ALPHABET.length)],
  ).join('');

  return formatPairingCode(code);
}

/**
 * Hash do código de pareamento.
 *
 * Diferente do token de sessão (256 bits de entropia), o código é curto por
 * necessidade de uso: sozinho ele cairia em força bruta offline se o banco
 * vazasse. Por isso o hash leva um "pepper" do servidor, além de o código ser de
 * uso único e expirar em minutos.
 */
export function hashPairingCode(code: string): string {
  return createHash('sha256')
    .update(`${process.env.AUTH_SECRET ?? ''}:${normalizePairingCode(code)}`)
    .digest('hex');
}

export type DeviceSession = {
  deviceId: string;
  idclinic: string;
  kind: DeviceKind;
  label: string;
};

type DeviceRow = {
  id: string;
  idclinic: string;
  kind: DeviceKind;
  label: string;
};

const toDeviceSession = (row: DeviceRow): DeviceSession => ({
  deviceId: row.id,
  idclinic: row.idclinic,
  kind: row.kind,
  label: row.label,
});

/** Memoized per request, like `getSessionUser`, so a page can call it repeatedly. */
export const getDeviceSession = cache(async (): Promise<DeviceSession | null> => {
  const store = await cookies();
  const token = store.get(DEVICE_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const hash = hashDeviceToken(token);

  try {
    const data = await sql<DeviceRow>`
      SELECT id, idclinic, kind, label
      FROM smarthealth.devices
      WHERE token_hash = ${hash} AND revokedat IS NULL
    `;

    const row = data.rows[0];
    return row ? toDeviceSession(row) : null;
  } catch (error) {
    console.error('Database Error:', error);
    return null;
  }
});

/** Sends an unpaired (or wrongly paired) device to the pairing screen. */
export async function requireDeviceClinic(kind?: DeviceKind): Promise<DeviceSession> {
  const device = await getDeviceSession();

  if (!device || (kind && device.kind !== kind)) {
    redirect(DEVICE_PAIRING_PATH);
  }

  return device;
}

/**
 * Troca o código curto por uma sessão: gera o token de 32 bytes, guarda só o hash
 * dele e consome o código (uso único). O token em texto claro vai apenas para o
 * cookie, no dispositivo.
 */
export async function pairDeviceWithCode(code: string): Promise<DeviceSession | null> {
  if (!isValidPairingCodeFormat(code)) {
    return null;
  }

  const secret = createDeviceToken();

  try {
    const data = await sql<DeviceRow>`
      UPDATE smarthealth.devices
      SET token_hash = ${hashDeviceToken(secret)},
          lastseenat = now(),
          pairingcodehash = NULL,
          pairingexpiresat = NULL
      WHERE pairingcodehash = ${hashPairingCode(code)}
        AND revokedat IS NULL
        AND pairingexpiresat > now()
      RETURNING id, idclinic, kind, label
    `;

    const row = data.rows[0];

    if (!row) {
      return null;
    }

    const store = await cookies();

    store.set(DEVICE_COOKIE, secret, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    });

    return toDeviceSession(row);
  } catch (error) {
    console.error('Database Error:', error);
    return null;
  }
}

export async function unpairDevice(): Promise<void> {
  const store = await cookies();
  store.delete(DEVICE_COOKIE);
}
