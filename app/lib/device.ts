/**
 * Single source of truth for device kinds.
 *
 * Lives in `app/lib` for the same reason as `roles.ts`: the domain models and
 * the client components both consume it (the pairing screens run in the
 * browser), and a module with no domain dependencies cannot create a
 * domain → lib cycle.
 */
export const DEVICE_KINDS = ['totem', 'painel'] as const;

export type DeviceKind = (typeof DEVICE_KINDS)[number];

/**
 * Onde um dispositivo sem credencial se pareia. Mora aqui, e não em
 * `device-session.ts`, porque as telas de gerência (client components) também
 * precisam exibir este endereço — e aquele módulo é server-only.
 *
 * É curto de propósito: em uma TV o endereço é digitado com o controle remoto.
 * `/totem/parear` continua existindo como alias e mostra a mesma tela.
 */
export const DEVICE_PAIRING_PATH = '/tv';

/**
 * Tela inicial de cada tipo de dispositivo. É um `Record` completo de propósito:
 * um tipo novo de dispositivo não compila sem uma tela definida — foi exatamente
 * a falta disso que fez um telão pareado cair na tela do totem.
 */
const DEVICE_HOME: Record<DeviceKind, string> = {
  totem: '/totem',
  painel: '/painel',
};

export function deviceHomePath(kind: DeviceKind): string {
  return DEVICE_HOME[kind];
}

/**
 * Endereço que o técnico abre no dispositivo para parear.
 *
 * Os dois tipos pareiam na mesma tela, alcançável pelos dois caminhos: o totem
 * tem tela própria (`/totem`, que sem pareamento mostra o formulário) e o telão
 * usa o endereço curto `/tv`. Dizer o endereço do próprio dispositivo evita a
 * instrução errada — antes, criar um totem mandava abrir `/tv`.
 */
export function devicePairingHintPath(kind: DeviceKind): string {
  return kind === 'painel' ? DEVICE_PAIRING_PATH : DEVICE_HOME[kind];
}

/**
 * Alfabeto sem caracteres ambíguos (fora 0/O, 1/I/L) porque o código é lido em
 * voz alta ou digitado em um controle remoto, onde "O" e "0" se confundem.
 */
export const PAIRING_CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

export const PAIRING_CODE_LENGTH = 8;

/** Código curto é segredo pequeno: vale por pouco tempo e só serve uma vez. */
export const PAIRING_CODE_TTL_MINUTES = 15;

/** "k7m4-2qp9" → "K7M42QP9". */
export function normalizePairingCode(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, '');
}

/** "K7M42QP9" → "K7M4-2QP9": agrupado em dois blocos de 4, bem mais fácil de digitar. */
export function formatPairingCode(value: string): string {
  const code = normalizePairingCode(value);

  return code.length > 4 ? `${code.slice(0, 4)}-${code.slice(4, PAIRING_CODE_LENGTH)}` : code;
}

export function isValidPairingCodeFormat(value: string): boolean {
  const code = normalizePairingCode(value);

  return (
    code.length === PAIRING_CODE_LENGTH &&
    [...code].every((character) => PAIRING_CODE_ALPHABET.includes(character))
  );
}
