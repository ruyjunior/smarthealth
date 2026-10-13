export const PUBLIC_PATHS = [
  '/',
  '/plans',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/confirm',
  '/auth',
  '/auth/register',
  '/auth/confirm',
];

export const PROTECTED_PATHS = [
  '/dashboard',
  '/budget',
  '/clients',
  '/notes',
  '/services',
  '/user',
  '/help',
  '/manager',
];

export function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export function isProtectedPath(pathname: string) {
  return PROTECTED_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export function isManagerPath(pathname: string) {
  return pathname === '/manager' || pathname.startsWith('/manager/');
}
