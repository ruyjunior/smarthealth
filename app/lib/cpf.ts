/** Keeps only the digits, so masked keyboard input can be handled uniformly. */
export function normalizeCpf(value: string): string {
  return value.replace(/\D/g, '');
}

/** Rejects repeated digits and recomputes both check digits. */
export function isValidCpf(value: string): boolean {
  const cpf = normalizeCpf(value);

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  const digits = cpf.split('').map(Number);

  const checkDigit = (length: number) => {
    let sum = 0;

    for (let i = 0; i < length; i += 1) {
      sum += digits[i] * (length + 1 - i);
    }

    const rest = (sum * 10) % 11;
    return rest === 10 ? 0 : rest;
  };

  return checkDigit(9) === digits[9] && checkDigit(10) === digits[10];
}

/** `000.000.000-00`; anything with another length is returned as digits only. */
export function formatCpf(value: string): string {
  const cpf = normalizeCpf(value);

  if (cpf.length !== 11) {
    return cpf;
  }

  return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9)}`;
}
