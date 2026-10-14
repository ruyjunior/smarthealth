import { describe, expect, it } from 'vitest';
import {
  PRIORITY_AGE,
  TICKET_PREFIXES,
  ageInYears,
  estimateWaitMinutes,
  formatTicketCode,
  resolvePriority,
} from './queue-ticket';

describe('formatTicketCode', () => {
  it('pads the sequence to three digits', () => {
    expect(formatTicketCode('A', 1)).toBe('A001');
    expect(formatTicketCode('P', 42)).toBe('P042');
  });

  it('does not truncate a sequence beyond three digits', () => {
    expect(formatTicketCode('A', 1000)).toBe('A1000');
    expect(formatTicketCode('P', 1000)).toBe('P1000');
  });

  it('exposes the line prefixes and the statutory age', () => {
    expect(TICKET_PREFIXES).toEqual({ normal: 'A', priority: 'P' });
    expect(PRIORITY_AGE).toBe(60);
  });
});

describe('ageInYears', () => {
  const today = new Date('2026-10-13T12:00:00Z');

  it('counts a birthday that already happened this year', () => {
    expect(ageInYears('1966-10-13', today)).toBe(60);
    expect(ageInYears('1966-10-12', today)).toBe(60);
  });

  it('does not count a birthday still to come', () => {
    expect(ageInYears('1966-10-14', today)).toBe(59);
    expect(ageInYears('1966-12-31', today)).toBe(59);
  });

  it('reads a date-only value without shifting the day', () => {
    expect(ageInYears('2000-01-01', today)).toBe(26);
    expect(ageInYears(new Date('1966-10-13T00:00:00Z'), today)).toBe(60);
  });

  it('returns null for a missing birth date', () => {
    expect(ageInYears(null, today)).toBeNull();
    expect(ageInYears(undefined, today)).toBeNull();
    expect(ageInYears('', today)).toBeNull();
  });

  it('returns null for an unparseable birth date', () => {
    expect(ageInYears('not-a-date', today)).toBeNull();
    expect(ageInYears(new Date('nonsense'), today)).toBeNull();
  });
});

/*
 * `resolvePriority` reads the real clock, so the boundary cases derive the birth
 * date from today: a 60-year-old's birthday today and the same person one day
 * short of it.
 */
function birthOnRelativeDay(yearsAgo: number, dayOffset: number): string {
  const today = new Date();
  const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + dayOffset);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${date.getFullYear() - yearsAgo}-${month}-${day}`;
}

describe('resolvePriority', () => {
  it('puts 60+ in the priority line without any declaration', () => {
    expect(resolvePriority({ birth: birthOnRelativeDay(80, 0) })).toEqual({
      priority: true,
      reason: 'Idoso (60+)',
      prefix: 'P',
    });
  });

  it('counts the 60th birthday of today as priority', () => {
    expect(resolvePriority({ birth: birthOnRelativeDay(60, 0) })).toEqual({
      priority: true,
      reason: 'Idoso (60+)',
      prefix: 'P',
    });
  });

  it('keeps a 59-year-old without a declaration in the normal line', () => {
    expect(resolvePriority({ birth: birthOnRelativeDay(60, 1) })).toEqual({
      priority: false,
      reason: null,
      prefix: 'A',
    });
  });

  it('puts a younger patient in the normal line even without a birth date', () => {
    expect(resolvePriority({ birth: birthOnRelativeDay(30, 0) })).toEqual({
      priority: false,
      reason: null,
      prefix: 'A',
    });
    expect(resolvePriority({ birth: null })).toEqual({
      priority: false,
      reason: null,
      prefix: 'A',
    });
    expect(resolvePriority({})).toEqual({ priority: false, reason: null, prefix: 'A' });
  });

  it('honours an explicit legal preference without an eligible age', () => {
    expect(resolvePriority({ birth: birthOnRelativeDay(30, 0), declared: true })).toEqual({
      priority: true,
      reason: 'Preferência legal declarada',
      prefix: 'P',
    });
  });

  it('lets the age win over the self-declared preference', () => {
    expect(resolvePriority({ birth: birthOnRelativeDay(80, 0), declared: true }).reason).toBe(
      'Idoso (60+)',
    );
    expect(resolvePriority({ birth: birthOnRelativeDay(80, 0), declared: false }).reason).toBe(
      'Idoso (60+)',
    );
  });
});

describe('estimateWaitMinutes', () => {
  it('multiplies the people ahead by the default 15 minutes', () => {
    expect(estimateWaitMinutes(0)).toBe(0);
    expect(estimateWaitMinutes(3)).toBe(45);
  });

  it('never returns a negative estimate', () => {
    expect(estimateWaitMinutes(-4)).toBe(0);
  });

  it('respects a custom minutes per patient', () => {
    expect(estimateWaitMinutes(4, 7)).toBe(28);
    expect(estimateWaitMinutes(0, 7)).toBe(0);
  });
});
