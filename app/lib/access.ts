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
  '/privacidade',
  '/termos',
  // O quiosque da recepção não tem login: a credencial dele é o pareamento
  // (Gerência > Atendimento), que cria o cookie lido por `requireDeviceClinic`.
  '/totem',
  // Alias curto de `/totem/parear`, para digitar o endereço na TV.
  '/tv',
  // Telão de chamadas: público pelo mesmo motivo do totem (dispositivo pareado).
  '/painel',
];

export const PROTECTED_PATHS = [
  '/dashboard',
  '/budget',
  '/clients',
  '/notes',
  '/services',
  '/fila',
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
