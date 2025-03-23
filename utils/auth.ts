import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { sql } from "@vercel/postgres";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { JWT } from "next-auth/jwt";
import { User } from "next-auth/providers/notion";

async function getUser(email: string): Promise< User | null> {
  try {
    const users = await sql<User>`SELECT * FROM smarthealth.users WHERE email=${email}`;
    return users.rows[0] || null;
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return null;
  }
}

export const {handlers, auth, signIn, signOut} = NextAuth({
  pages: {
    signIn: "/login",
    signOut: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        // Validação com Zod
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          console.log("Credenciais inválidas");
          return null;
        }

        const { email, password } = parsedCredentials.data;
        const user = await getUser(email);
        if (!user) {
          console.log("Usuário não encontrado.");
          return null;
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) {
          console.log("Senha incorreta.");
          return null;
        }
        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7, // 7 dias
    updateAge: 60 * 60 * 2 // Atualiza o token a cada 1 hora
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 7 // Expiração do token JWT
  },
  callbacks: {
    async jwt ({ token, user }) {
      //console.log("Dados do usuário no JWT antes:", token); // Debug
      if (user) {
        return {
        ...token,
        id : user.id,
        name : user.name,
        email : user.email,
        };
      }
      //console.log("Token final com role:", token); // Debug
      return token;
    },
    async session({ session, token }: { session: any, token: JWT }) {
      if (session.user) {
          session.user.id = token.id as string;
          session.user.name =  token.name as string;
          session.user.email =  token.email as string;
        }
      return session;
    },
    async redirect({ url, baseUrl }: { url: string, baseUrl: string }) {
      // Redireciona para /dashboard após login
      if (url === '/') {
        return `${baseUrl}/dashboard`;
      }
      return baseUrl;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});