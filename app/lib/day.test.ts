import { describe, expect, it } from 'vitest';
import { CLINIC_TIME_ZONE, clinicDay } from './day';

/*
 * O fuso é sempre passado explicitamente via `Date`, para que o resultado não
 * dependa do fuso da máquina que roda os testes. O Brasil não tem mais horário
 * de verão desde 2019, então a virada relevante para a fila é a do dia e a do
 * ano (às 21:00 de São Paulo o UTC já virou).
 */
describe('clinicDay', () => {
  it('uses the clinic time zone', () => {
    expect(CLINIC_TIME_ZONE).toBe('America/Sao_Paulo');
  });

  it('keeps the São Paulo calendar day right after midnight UTC', () => {
    expect(clinicDay(new Date('2026-10-14T02:30:00Z'))).toBe('2026-10-13');
    expect(clinicDay(new Date('2026-10-14T03:00:00Z'))).toBe('2026-10-14');
  });

  it('flips the day at 21:00 in São Paulo, not at UTC midnight', () => {
    // 21:00 do dia 14 em São Paulo já é o dia 15 em UTC, mas a fila ainda é do dia 14
    expect(clinicDay(new Date('2026-10-15T00:00:00Z'))).toBe('2026-10-14');
    expect(clinicDay(new Date('2026-10-15T02:59:59Z'))).toBe('2026-10-14');
    expect(clinicDay(new Date('2026-10-15T03:00:00Z'))).toBe('2026-10-15');
    expect(clinicDay(new Date(0))).toBe('1969-12-31');
  });

  it('rolls the year over in the clinic time zone', () => {
    expect(clinicDay(new Date('2027-01-01T02:30:00Z'))).toBe('2026-12-31');
    expect(clinicDay(new Date('2027-01-01T03:00:00Z'))).toBe('2027-01-01');
  });

  it('always returns YYYY-MM-DD', () => {
    expect(clinicDay(new Date('2026-10-14T03:00:00Z'))).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
