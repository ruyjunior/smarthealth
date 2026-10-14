/**
 * The queue is numbered per clinic calendar day, not per UTC day:
 * `toISOString()` (the pattern used in `services/queries.ts`) would flip the
 * date at 21:00 in São Paulo, in the middle of the night shift.
 */
export const CLINIC_TIME_ZONE = 'America/Sao_Paulo';

const dayFormatter = new Intl.DateTimeFormat('en-CA', { timeZone: CLINIC_TIME_ZONE });

/** `YYYY-MM-DD` for the given instant in the clinic time zone. */
export function clinicDay(date: Date = new Date()): string {
  return dayFormatter.format(date);
}
