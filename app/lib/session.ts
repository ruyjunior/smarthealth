import { cache } from 'react';
import { redirect } from 'next/navigation';
import { sql } from '@vercel/postgres';
import { auth } from '@/app/lib/auth';
import { isManager } from '@/app/lib/roles';
import type { User } from '@/app/domains/users/types';

/**
 * Resolves the signed-in user once per request.
 *
 * React's `cache()` memoizes the call for the duration of a single request, so
 * the ~26 places that used to run `auth()` + `fetchUserById()` on their own now
 * share one lookup instead of repeating the same SELECT several times per render.
 *
 * This module must stay free of runtime imports from `app/domains/*` to avoid a
 * cycle (the domain queries depend on it); type-only imports are erased and are
 * therefore safe.
 */
export const getSessionUser = cache(async (): Promise<User | null> => {
  const session = await auth();
  const id = session?.user?.id;

  if (!id) {
    return null;
  }

  try {
    const data = await sql<User>`
      SELECT
        id, name, email, role, idclinic, avatarurl, category, pronoun
      FROM smarthealth.users
      WHERE users.id = ${id}
    `;

    return data.rows[0] ?? null;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch user.');
  }
});

/** Same as `getSessionUser`, but sends the visitor to the login page when there is none. */
export async function requireSessionUser(): Promise<User> {
  const user = await getSessionUser();

  if (!user) {
    redirect('/login');
  }

  return user;
}

/** Clinic the current user belongs to. Memoized along with the session lookup. */
export const getCurrentClinicId = cache(async (): Promise<string> => {
  const user = await requireSessionUser();

  if (!user.idclinic) {
    redirect('/sem-clinica');
  }

  return user.idclinic;
});

/** Same as `requireSessionUser`, but sends non-managers to their dashboard. */
export const requireManager = cache(async (): Promise<User> => {
  const user = await requireSessionUser();

  if (!isManager(user.role)) {
    redirect('/dashboard');
  }

  return user;
});

/**
 * Tenant scope for manager-only mutations. Server actions are public endpoints,
 * so the clinic must always be derived here rather than accepted as an argument.
 */
export const requireManagerClinicId = cache(async (): Promise<string> => {
  const user = await requireManager();

  if (!user.idclinic) {
    redirect('/sem-clinica');
  }

  return user.idclinic;
});
