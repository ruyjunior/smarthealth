import { describe, expect, it } from 'vitest';
import {
  DEVICE_PAIRING_PATH,
  PAIRING_CODE_ALPHABET,
  PAIRING_CODE_LENGTH,
  PAIRING_CODE_TTL_MINUTES,
  deviceHomePath,
  devicePairingHintPath,
  formatPairingCode,
  isValidPairingCodeFormat,
  normalizePairingCode,
} from './device';

describe('pairing code alphabet', () => {
  it('excludes the characters that get confused on a remote control', () => {
    // "O" e "0", "I"/"l" e "1" se confundem quando alguém lê o código em voz alta
    // ou digita em um controle remoto.
    for (const ambiguous of ['O', '0', 'I', 'L', '1']) {
      expect(PAIRING_CODE_ALPHABET, `alfabeto não pode conter ${ambiguous}`).not.toContain(
        ambiguous,
      );
    }
  });

  it('has no duplicates and enough symbols for the code length', () => {
    expect(new Set(PAIRING_CODE_ALPHABET).size).toBe(PAIRING_CODE_ALPHABET.length);
    expect(PAIRING_CODE_ALPHABET.length).toBeGreaterThanOrEqual(30);
    expect(PAIRING_CODE_LENGTH).toBeGreaterThanOrEqual(8);
  });

  it('expires the code quickly, since it is a short secret', () => {
    expect(PAIRING_CODE_TTL_MINUTES).toBeLessThanOrEqual(30);
    expect(PAIRING_CODE_TTL_MINUTES).toBeGreaterThan(0);
  });
});

describe('normalizePairingCode', () => {
  it('accepts what a human would type: lowercase, spaced or with the hyphen', () => {
    expect(normalizePairingCode('k7m4-2qp9')).toBe('K7M42QP9');
    expect(normalizePairingCode('K7M4 2QP9')).toBe('K7M42QP9');
    expect(normalizePairingCode(' K7M4.2QP9 ')).toBe('K7M42QP9');
  });

  it('returns an empty string for input without usable characters', () => {
    expect(normalizePairingCode('')).toBe('');
    expect(normalizePairingCode(' - . ')).toBe('');
  });
});

describe('formatPairingCode', () => {
  it('groups the code in two blocks of four', () => {
    expect(formatPairingCode('K7M42QP9')).toBe('K7M4-2QP9');
  });

  it('formats partial input without inventing a separator', () => {
    expect(formatPairingCode('K7M4')).toBe('K7M4');
    expect(formatPairingCode('K7M')).toBe('K7M');
  });

  it('never returns more than the code length', () => {
    expect(formatPairingCode('K7M42QP9XYZ')).toBe('K7M4-2QP9');
  });
});

describe('isValidPairingCodeFormat', () => {
  it('accepts a well-formed code, with or without the hyphen', () => {
    expect(isValidPairingCodeFormat('K7M4-2QP9')).toBe(true);
    expect(isValidPairingCodeFormat('k7m42qp9')).toBe(true);
  });

  it('rejects codes with the wrong length', () => {
    expect(isValidPairingCodeFormat('K7M42QP')).toBe(false);
    expect(isValidPairingCodeFormat('K7M42QP9X')).toBe(false);
    expect(isValidPairingCodeFormat('')).toBe(false);
  });

  it('rejects characters that are not in the alphabet', () => {
    // Rejeitar em vez de "corrigir" evita trocar um erro de digitação por outra senha.
    expect(isValidPairingCodeFormat('K7M4-2QPO')).toBe(false);
    expect(isValidPairingCodeFormat('K7M4-2QP0')).toBe(false);
    expect(isValidPairingCodeFormat('K7M4-2QPI')).toBe(false);
    expect(isValidPairingCodeFormat('K7M4-2Q@9')).toBe(false);
  });
});

describe('pairing routes', () => {
  it('uses the short address, which is what fits a TV remote', () => {
    expect(DEVICE_PAIRING_PATH).toBe('/tv');
  });

  it('sends each device kind to its own screen', () => {
    expect(deviceHomePath('totem')).toBe('/totem');
    expect(deviceHomePath('painel')).toBe('/painel');
  });

  it('tells the technician the address of the device being paired', () => {
    // Um totem não deve receber instrução para abrir `/tv`.
    expect(devicePairingHintPath('totem')).toBe('/totem');
    expect(devicePairingHintPath('painel')).toBe('/tv');
  });
});
