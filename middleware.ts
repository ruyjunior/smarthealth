import { auth } from '@/app/lib/auth';
import { isManagerPath, isProtectedPath, isPublicPath } from '@/app/lib/access';
import { isManager } from '@/app/lib/roles';
import { NextResponse } from 'next/server';

export async function middleware(request: Request) {
  const session = await auth();
  const { pathname } = new URL(request.url);

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  if (!session?.user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isProtectedPath(pathname) && isManagerPath(pathname) && !isManager(session.user.role)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard',
    '/dashboard/:path*',
    '/budget',
    '/budget/:path*',
    '/clients',
    '/clients/:path*',
    '/notes',
    '/notes/:path*',
    '/services',
    '/services/:path*',
    '/user',
    '/user/:path*',
    '/manager',
    '/manager/:path*',
  ],
};
