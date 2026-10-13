import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Configuração do transporte de e-mails
const transporter = nodemailer.createTransport({
  service: 'gmail', // ou outro serviço SMTP
  auth: {
    user: process.env.EMAIL_USER, // Definir no .env.local
    pass: process.env.EMAIL_PASS, // Definir no .env.local
  },
});

// Função para gerar token aleatório
const generateToken = () => crypto.randomBytes(32).toString('hex');

/** No máximo alguns links válidos por conta ao mesmo tempo. */
const MAX_LIVE_TOKENS = 3;

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (char) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char] as string,
  );

/*
 * A resposta é sempre a mesma, exista a conta ou não: dizer "e-mail não
 * cadastrado" aqui (e no formulário de login) entrega quais endereços têm conta.
 */
const GENERIC_RESPONSE = {
  message: 'Se este e-mail estiver cadastrado, enviaremos o link de acesso.',
};

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const email = typeof body?.email === 'string' ? body.email.trim() : '';

    if (!email || email.length > 254 || !email.includes('@')) {
      return NextResponse.json({ message: 'E-mail obrigatório!' }, { status: 400 });
    }

    const userResult = await sql`
      SELECT id, name, pronoun FROM smarthealth.users WHERE email = ${email}
    `;
    const user = userResult.rows[0];

    /*
     * Contas nascem pelo cadastro feito pelo gerente ou pelo webhook da
     * contratação. Este endpoint é público, então endereço desconhecido não cria
     * usuário nenhum — antes ele gravava uma linha sem clínica e sem papel.
     */
    if (!user) {
      return NextResponse.json(GENERIC_RESPONSE);
    }

    const liveTokens = await sql`
      SELECT COUNT(*) FROM smarthealth.auth_tokens
      WHERE user_id = ${user.id} AND expires_at > ${new Date().toISOString()}
    `;

    if (Number(liveTokens.rows[0].count) >= MAX_LIVE_TOKENS) {
      return NextResponse.json(GENERIC_RESPONSE);
    }

    // Gerar um token temporário
    const token = generateToken();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30).toISOString(); // Converte para string

    // Salvar token no banco
    await sql`
      INSERT INTO smarthealth.auth_tokens (user_id, token, expires_at) 
      VALUES (${user.id}, ${token}, ${expiresAt})
    `;

    // Criar link de acesso
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const link = `${baseUrl}/auth/confirm?token=${token}`;

    // Enviar e-mail
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Link de acesso Smart Health',
      html: `
        <h2>Smart Health</h2>
        <p>Olá ${escapeHtml(user.pronoun ?? '')} ${escapeHtml(user.name ?? '')},</p>
        <p>Você está recebendo este e-mail para mudança ou primeiro cadastro de senha para sua conta.</p>
        <p>
          <a href="${link}">Clique aqui para mudar sua senha e acessar sua conta</a>
        </p>
        <p>Ou copie e cole este link no seu navegador:<br>${link}</p>
        <p>O link expira em 30 minutos.<br>Se você não solicitou, ignore este e-mail.</p>
        <hr>
        <small>Smart Health &copy; ${new Date().getFullYear()}</small>
      `,
    });

    return NextResponse.json(GENERIC_RESPONSE);
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    return NextResponse.json({ message: 'Erro ao processar a solicitação.' }, { status: 500 });
  }
}
