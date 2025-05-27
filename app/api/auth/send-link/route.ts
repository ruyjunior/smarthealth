import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import nodemailer from "nodemailer";
import crypto from "crypto";

// Configuração do transporte de e-mails
const transporter = nodemailer.createTransport({
  service: "gmail", // ou outro serviço SMTP
  auth: {
    user: process.env.EMAIL_USER, // Definir no .env.local
    pass: process.env.EMAIL_PASS, // Definir no .env.local
  },
});

// Função para gerar token aleatório
const generateToken = () => crypto.randomBytes(32).toString("hex");

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    //console.log("E-mail recebido:", email);
    if (!email) {
      return NextResponse.json({ message: "E-mail obrigatório!" }, { status: 400 });
    }

    const userResult = await sql`SELECT * FROM smarthealth.users WHERE email = ${email}`;
    let user = userResult.rows[0];

    if (!user) {
      const insertedUser = await sql`INSERT INTO smarthealth.users (email) VALUES (${email}) RETURNING id, email`;
      user = insertedUser.rows[0];
    }
    // Gerar um token temporário
    const token = generateToken();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30).toISOString(); // Converte para string

    // Salvar token no banco (Criar a tabela `auth_tokens` se ainda não existir)
    await sql`
      INSERT INTO smarthealth.auth_tokens (user_id, token, expires_at) 
      VALUES (${user.id}, ${token}, ${expiresAt})
    `;

    // Criar link de acesso
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const link = `${baseUrl}/auth/confirm?token=${token}`;

    // Enviar e-mail
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Link de acesso Smart Health",
      html: `
        <h2>Smart Health</h2>
        <p>Olá,</p>
        <p>Recebemos uma solicitação para mudança de senha para sua conta.</p>
        <p>
          <a href="${link}">Clique aqui para mudar sua senha e acessar sua conta</a>
        </p>
        <p>Ou copie e cole este link no seu navegador:<br>${link}</p>
        <p>O link expira em 30 minutos.<br>Se você não solicitou, ignore este e-mail.</p>
        <hr>
        <small>Smart Health &copy; ${new Date().getFullYear()}</small>
      `,
    });

    return NextResponse.json({ message: "E-mail enviado! Verifique sua caixa de entrada." });
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    return NextResponse.json({ message: "Erro ao processar a solicitação." }, { status: 500 });
  }
}
