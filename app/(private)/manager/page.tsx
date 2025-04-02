'use client'
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function Manager() {
  const { data: session } = useSession();
  if (!session) return <p>Carregando...</p>;
  console.log(session.user.role);

  return (
    <main className="flex items-center justify-center md:h-screen">

      <div className="max-w-md mx-auto mt-1 p-1 shadow-md rounded-md">
        <div className="mb-10">
          <h1>DASHBOARD GERÊNCIA</h1>
          <h1>Bem-vindo, {session?.user?.name}</h1>
          {session?.user?.role === "manager" ? (
            <p>🔹 Você é um gerente! Acesse <a href="/dashboard/gerente">painel de gerência</a></p>
          ) : (
            <p>🔹 Você é um funcionário.</p>
          )}

        </div>
        <Image
          src="/images/logo.png"
          width={500}
          height={500}
          alt="Logo da Empresa"
          className="rounded-md" />
      </div>

    </main>
  );
}