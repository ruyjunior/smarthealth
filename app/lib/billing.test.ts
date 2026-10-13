import { describe, expect, it } from 'vitest';
import { addInterval } from './billing';

describe('addInterval', () => {
  it('advances a month', () => {
    expect(addInterval(new Date('2026-10-15T12:00:00Z'), 'month')?.toISOString()).toBe(
      '2026-11-15T12:00:00.000Z',
    );
  });

  it('advances a year', () => {
    expect(addInterval(new Date('2026-10-15T12:00:00Z'), 'year')?.toISOString()).toBe(
      '2027-10-15T12:00:00.000Z',
    );
  });

  it('returns null for an interval it does not bill', () => {
    expect(addInterval(new Date(), 'week')).toBeNull();
    expect(addInterval(new Date(), null)).toBeNull();
    expect(addInterval(new Date(), undefined)).toBeNull();
  });

  it('does not mutate the date it was given', () => {
    const from = new Date('2026-10-15T12:00:00Z');
    addInterval(from, 'year');
    expect(from.toISOString()).toBe('2026-10-15T12:00:00.000Z');
  });

  it('rolls over the end of a month the way JavaScript does', () => {
    // 31/01 + 1 mês não existe, então o Date "transborda" para 03/03.
    // Documentado de propósito: é por isso que o vencimento normal vem do
    // fim de período calculado pelo Stripe, e não daqui.
    expect(addInterval(new Date('2026-01-31T00:00:00Z'), 'month')?.toISOString()).toBe(
      '2026-03-03T00:00:00.000Z',
    );
  });
});
