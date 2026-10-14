import { normalizeCpf } from '@/app/lib/cpf';

/**
 * Keeps only the last two digits, so the CPF can be confirmed on a shared
 * screen (telão, totem) without exposing the whole number.
 */
export function maskCpf(value: string): string {
  const cpf = normalizeCpf(value);

  if (cpf.length !== 11) {
    return '';
  }

  return `***.***.***-${cpf.slice(9)}`;
}

/** `Maria Aparecida Souza` → `Maria A. S.` — for public screens and short lists. */
export function abbreviateName(name: string | null | undefined): string {
  if (!name) {
    return '';
  }

  const [first, ...rest] = name.trim().split(/\s+/).filter(Boolean);

  if (!first) {
    return '';
  }

  return [first, ...rest.map((part) => `${part[0].toUpperCase()}.`)].join(' ');
}
