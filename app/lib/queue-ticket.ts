/** Prefix that identifies the line a ticket belongs to. */
export const TICKET_PREFIXES = { normal: 'A', priority: 'P' } as const;

export type TicketPrefix = 'A' | 'P';

/** Statutory priority age (Estatuto da Pessoa Idosa). */
export const PRIORITY_AGE = 60;

export function formatTicketCode(prefix: TicketPrefix, sequence: number): string {
  return `${prefix}${String(sequence).padStart(3, '0')}`;
}

/** Fields of a date-only value, read without letting the time zone roll the day over. */
function civilDate(value: string | Date): { year: number; month: number; day: number } | null {
  if (typeof value === 'string') {
    // Campo a campo: `new Date('2000-01-01')` é meia-noite UTC, que em São
    // Paulo (UTC-3) cai no dia anterior.
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);

    return match
      ? { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) }
      : civilDate(new Date(value));
  }

  if (Number.isNaN(value.getTime())) {
    return null;
  }

  // Uma coluna `date` chega como meia-noite local e `new Date('2000-01-01')`
  // como meia-noite UTC: usa a leitura que não desloca o dia.
  const atMidnight = (utc: boolean) =>
    (utc ? value.getUTCHours() : value.getHours()) === 0 &&
    (utc ? value.getUTCMinutes() : value.getMinutes()) === 0 &&
    (utc ? value.getUTCSeconds() : value.getSeconds()) === 0;

  return atMidnight(false) || !atMidnight(true)
    ? { year: value.getFullYear(), month: value.getMonth() + 1, day: value.getDate() }
    : { year: value.getUTCFullYear(), month: value.getUTCMonth() + 1, day: value.getUTCDate() };
}

/** Full years between `birth` and `today`; null when the date is missing or invalid. */
export function ageInYears(
  birth: string | Date | null | undefined,
  today: Date = new Date(),
): number | null {
  if (!birth) {
    return null;
  }

  const born = civilDate(birth);
  const now = civilDate(today);

  if (!born || !now) {
    return null;
  }

  let age = now.year - born.year;

  if (now.month < born.month || (now.month === born.month && now.day < born.day)) {
    age -= 1;
  }

  return age;
}

/** Age wins over the self-declared preference: both end up in the priority line. */
export function resolvePriority({
  birth,
  declared,
}: {
  birth?: string | null;
  declared?: boolean;
}): { priority: boolean; reason: string | null; prefix: TicketPrefix } {
  const age = ageInYears(birth);

  if (age !== null && age >= PRIORITY_AGE) {
    return { priority: true, reason: 'Idoso (60+)', prefix: 'P' };
  }

  if (declared === true) {
    return { priority: true, reason: 'Preferência legal declarada', prefix: 'P' };
  }

  return { priority: false, reason: null, prefix: 'A' };
}

export function estimateWaitMinutes(peopleAhead: number, minutesPerPatient = 15): number {
  return Math.max(0, peopleAhead) * minutesPerPatient;
}
