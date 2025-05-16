import { auth } from "@/app/lib/auth"; // Certifique-se de que auth está exportado corretamente
import { NextResponse } from "next/server";

export async function middleware(request: Request) {
  const session = await auth(); // auth() já retorna os dados da sessão corretamente
  const isLoggedIn = !!session?.user; // Agora acessamos session.user diretamente
  const isManager = session?.user.role === 'Gerente';

  const { pathname } = new URL(request.url);
  const isPublicRoute = pathname === "/" || pathname === "/plans" ||
    pathname === "/login" || pathname === "/register" ||
    pathname === "/forgot-password" || pathname === "/reset-password";
  
  const managerRoute = pathname === "/manager";

  if (!isPublicRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!isManager && managerRoute){
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } 

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/manager"],
};
