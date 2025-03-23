import { auth } from "@/utils/auth"; // Certifique-se de que auth está exportado corretamente
import { NextResponse } from "next/server";
import NextAuth from 'next-auth';

export async function middleware(request: Request) {
  const session = await auth(); // auth() já retorna os dados da sessão corretamente
  const isLoggedIn = !!session?.user; // Agora acessamos session.user diretamente

  const { pathname } = new URL(request.url);
  const isPublicRoute = pathname === "/" || pathname === "/plans" ||
    pathname === "/login" || pathname === "/register" ||
    pathname === "/forgot-password" || pathname === "/reset-password";

  if (!isPublicRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
