/**
 * Single source of truth for user roles.
 *
 * Lives in `app/lib` (which has no domain dependencies) so the domain models,
 * the middleware and the client components can all import it without pulling
 * server-only code into the browser bundle.
 */
export const USER_ROLES = ['Gerente', 'Funcionário'] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const MANAGER_ROLE: UserRole = 'Gerente';

/** True when the given role has manager privileges. */
export function isManager(role: string | null | undefined): boolean {
  return role === MANAGER_ROLE;
}
