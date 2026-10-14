import type { DeviceKind } from '@/app/lib/device';

export type Device = {
  id: string;
  idclinic: string;
  label: string;
  kind: DeviceKind;
  /** `true` quando o dispositivo já trocou o código por um token de sessão. */
  hassession: boolean;
  createdat: Date;
  lastseenat: Date | null;
  revokedat: Date | null;
  /** Validade do código de pareamento atual; `null` quando não há código pendente. */
  pairingexpiresat: Date | null;
};
