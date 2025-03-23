import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { token, password } = await req.json();

  if (!token || password.length < 6) {
    return NextResponse.json({ error: "Token inválido ou senha muito curta." }, { status: 400 });
  }

  const tokenResult = await sql`
    SELECT user_id, expires_at FROM smarthealth.auth_tokens WHERE token = ${token}
  `;

  const tokenData = tokenResult.rows[0];

  if (!tokenData || new Date(tokenData.expires_at) < new Date()) {
    return NextResponse.json({ error: "Token expirado ou inválido." }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await sql`
    UPDATE smarthealth.users SET password = ${hashedPassword} WHERE id = ${tokenData.user_id}
  `;

  await sql`
    DELETE FROM smarthealth.auth_tokens WHERE token = ${token}
  `;

  return NextResponse.json({ success: true });
}
