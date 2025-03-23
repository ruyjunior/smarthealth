import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt"; // Função para obter e verificar o token
import type { NextRequest } from "next/server";

// Configuração para o segredo do JWT
const secret = process.env.AUTH_SECRET;

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret });

  if (!token) {
    // Se o token não for encontrado ou for inválido, redireciona para a página de login
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Se o token for válido, continue para a próxima ação
  return NextResponse.next();
}

// Aplicar middleware apenas em rotas protegidas
export const config = {
  matcher: ["/dashboard/:path*"],
};
