import { describe, expect, it } from 'vitest';
import { formatCpf, isValidCpf, normalizeCpf } from './cpf';

// CPFs reais: os dígitos verificadores abaixo são os conhecidos, não recalculados aqui.
const VALID_CPF = '52998224725';
const ANOTHER_VALID_CPF = '11144477735';

describe('normalizeCpf', () => {
  it('keeps only the digits of a masked value', () => {
    expect(normalizeCpf('529.982.247-25')).toBe(VALID_CPF);
  });

  it('handles spaces and other separators', () => {
    expect(normalizeCpf(' 529 982 247 25 ')).toBe(VALID_CPF);
    expect(normalizeCpf('cpf: 529-982.247/25')).toBe(VALID_CPF);
  });

  it('returns an empty string when there is no digit', () => {
    expect(normalizeCpf('')).toBe('');
    expect(normalizeCpf('sem números')).toBe('');
  });
});

describe('isValidCpf', () => {
  it('accepts known valid CPFs', () => {
    expect(isValidCpf(VALID_CPF)).toBe(true);
    expect(isValidCpf(ANOTHER_VALID_CPF)).toBe(true);
  });

  it('accepts a masked CPF, normalising it first', () => {
    expect(isValidCpf('529.982.247-25')).toBe(true);
  });

  it('rejects a wrong check digit', () => {
    expect(isValidCpf('52998224724')).toBe(false);
    expect(isValidCpf('11144477734')).toBe(false);
  });

  it('rejects 11 repeated digits', () => {
    for (const repeated of ['00000000000', '11111111111', '99999999999']) {
      expect(isValidCpf(repeated)).toBe(false);
    }
  });

  it('rejects any length other than 11', () => {
    expect(isValidCpf('5299822472')).toBe(false);
    expect(isValidCpf('529982247250')).toBe(false);
    expect(isValidCpf('')).toBe(false);
  });

  it('rejects non-numeric input', () => {
    expect(isValidCpf('abcdefghijk')).toBe(false);
    expect(isValidCpf('529.982.247-aa')).toBe(false);
  });
});

describe('formatCpf', () => {
  it('formats 11 digits', () => {
    expect(formatCpf(VALID_CPF)).toBe('529.982.247-25');
    expect(formatCpf('529.982.247-25')).toBe('529.982.247-25');
  });

  it('returns digits only when the length is not 11', () => {
    expect(formatCpf('5299822472')).toBe('5299822472');
    expect(formatCpf('')).toBe('');
  });
});
