import { describe, expect, it } from 'vitest';
import {
  cn,
  formatCEP,
  formatCNPJ,
  formatCPF,
  formatCurrency,
  formatCurrencyInput,
  formatDateBr,
  formatDateDb,
  formatDateToLocal,
  formatPhone,
  formatTime,
  generatePagination,
  toPgArray,
} from './utils';

// some ICU builds render pt-BR currency with a non-breaking space
const plain = (value: string) => value.replace(/\u00a0/g, ' ');

describe('formatCurrency', () => {
  it('formats values as pt-BR BRL', () => {
    expect(plain(formatCurrency(1234.5))).toBe('R$ 1.234,50');
    expect(plain(formatCurrency(0))).toBe('R$ 0,00');
  });
});

describe('formatCurrencyInput', () => {
  it('treats the last two digits as cents', () => {
    expect(formatCurrencyInput('123456')).toBe('1234,56');
    expect(formatCurrencyInput('1')).toBe('0,01');
  });

  it('ignores anything that is not a digit', () => {
    expect(formatCurrencyInput('R$ 1.234,56')).toBe('1234,56');
  });
});

describe('toPgArray', () => {
  it('wraps text values and leaves booleans bare', () => {
    expect(toPgArray(['a', 'b'])).toBe('{"a","b"}');
    expect(toPgArray([true, false])).toBe('{true,false}');
    expect(toPgArray([])).toBe('{}');
  });

  it('escapes double quotes', () => {
    expect(toPgArray(['com "aspas"'])).toBe('{"com \\"aspas\\""}');
  });

  it('escapes backslashes so the stored value round-trips unchanged', () => {
    // Without this escaping Postgres reads \U as an escape and silently drops
    // the backslash, corrupting the field.
    expect(toPgArray(['C:\\Users\\x'])).toBe('{"C:\\\\Users\\\\x"}');
  });
});

describe('formatTime', () => {
  it('drops the seconds from a database time', () => {
    expect(formatTime('10:30:00')).toBe('10:30');
  });

  it('returns an empty string for missing values', () => {
    expect(formatTime(null)).toBe('');
    expect(formatTime(undefined)).toBe('');
    expect(formatTime('')).toBe('');
  });
});

describe('formatCPF / formatCNPJ / formatCEP / formatPhone', () => {
  it('masks a CPF', () => {
    expect(formatCPF('12345678901')).toBe('123.456.789-01');
  });

  it('masks a CNPJ', () => {
    expect(formatCNPJ('12345678000199')).toBe('12.345.678/0001-99');
  });

  it('masks a CEP', () => {
    expect(formatCEP('12345678')).toBe('12345-678');
  });

  it('masks landline and mobile phone numbers', () => {
    expect(formatPhone('1112345678')).toBe('(11) 1234-5678');
    expect(formatPhone('11912345678')).toBe('(11) 91234-5678');
  });

  it('returns an empty string for missing values', () => {
    for (const format of [formatCPF, formatCNPJ, formatCEP, formatPhone, formatDateBr]) {
      expect(format(null)).toBe('');
      expect(format(undefined)).toBe('');
      expect(format('')).toBe('');
    }
  });
});

describe('formatDateBr', () => {
  it('masks digits progressively as they are typed', () => {
    expect(formatDateBr('12')).toBe('12');
    expect(formatDateBr('1210')).toBe('12/10');
    expect(formatDateBr('12102026')).toBe('12/10/2026');
  });
});

describe('formatDateDb', () => {
  it('keeps the calendar day of a date-only string', () => {
    expect(formatDateDb('2026-10-12')).toBe('2026-10-12');
  });

  it('drops the time from a timestamp', () => {
    expect(formatDateDb('2026-10-12T15:30:00.000Z')).toBe('2026-10-12');
  });

  it('returns an empty string when there is no date', () => {
    expect(formatDateDb(null)).toBe('');
  });
});

describe('formatDateToLocal', () => {
  it('renders a date-only value without shifting the day', () => {
    expect(formatDateToLocal('2026-10-12')).toBe('12/10/2026');
  });

  it('returns an empty string when there is no date', () => {
    expect(formatDateToLocal(null)).toBe('');
  });
});

describe('cn', () => {
  it('joins the truthy classes', () => {
    expect(cn('a', false, undefined, null, 'b')).toBe('a b');
    expect(cn()).toBe('');
  });
});

describe('generatePagination', () => {
  it('lists every page when there are seven or fewer', () => {
    expect(generatePagination(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(generatePagination(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('collapses the tail while near the start', () => {
    expect(generatePagination(1, 20)).toEqual([1, 2, 3, '...', 19, 20]);
  });

  it('collapses the head while near the end', () => {
    expect(generatePagination(20, 20)).toEqual([1, 2, '...', 18, 19, 20]);
  });

  it('shows neighbours on both sides in the middle', () => {
    expect(generatePagination(10, 20)).toEqual([1, '...', 9, 10, 11, '...', 20]);
  });
});
