import { sql } from '@vercel/postgres';
import type { Device } from './types';

/** `token_hash` is never selected: it only exists in the database. */
export async function fetchDevices(idclinic: string) {
  try {
    const data = await sql<Device>`
      SELECT
        id, idclinic, label, kind, (token_hash IS NOT NULL) AS hassession,
        createdat, lastseenat, revokedat, pairingexpiresat
      FROM smarthealth.devices
      WHERE devices.idclinic = ${idclinic}
      ORDER BY label ASC
    `;

    return data.rows;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all devices.');
  }
}

export async function fetchDeviceById(idclinic: string, id: string) {
  try {
    const data = await sql<Device>`
      SELECT
        id, idclinic, label, kind, (token_hash IS NOT NULL) AS hassession,
        createdat, lastseenat, revokedat, pairingexpiresat
      FROM smarthealth.devices
      WHERE devices.id = ${id} AND devices.idclinic = ${idclinic}
    `;

    return data.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch device.');
  }
}
