import { describe, expect, it } from 'vitest';
import { abbreviateName, maskCpf } from './lgpd';

describe('maskCpf', () => {
  it('keeps only the last two digits', () => {
    expect(maskCpf('529.982.247-25')).toBe('***.***.***-25');
    expect(maskCpf('52998224725')).toBe('***.***.***-25');
  });

  it('returns an empty string when there is no complete CPF', () => {
    expect(maskCpf('')).toBe('');
    expect(maskCpf('529')).toBe('');
    expect(maskCpf('5299822472')).toBe('');
    expect(maskCpf('sem números')).toBe('');
  });
});

describe('abbreviateName', () => {
  it('abbreviates every surname after the first name', () => {
    expect(abbreviateName('Maria Aparecida Souza')).toBe('Maria A. S.');
  });

  it('leaves a single name untouched', () => {
    expect(abbreviateName('Maria')).toBe('Maria');
  });

  it('returns an empty string for a missing name', () => {
    expect(abbreviateName('')).toBe('');
    expect(abbreviateName('   ')).toBe('');
    expect(abbreviateName(null)).toBe('');
    expect(abbreviateName(undefined)).toBe('');
  });

  it('never emits empty tokens for extra whitespace', () => {
    expect(abbreviateName('  Maria \t Aparecida  Souza ')).toBe('Maria A. S.');
    expect(abbreviateName('\nMaria\nSouza\n')).toBe('Maria S.');
  });
});
