'use client';

import Image from "next/image";
import Nav from "@/app/components/main/Nav";
import { useSession, signOut } from "next-auth/react";
import { fetchUserById } from "@/app/query/users/data";
import { notFound } from "next/navigation";

export default function Sidebar() {
  const { data: session } = useSession();
  if (!session) return <p className="text-center text-white">Carregando...</p>;
  const id = session.user.id.toString();

  return (
    <aside className="h-screen w-20 md:w-64 fixed flex flex-col bg-gray-800 text-white shadow-md p-4 transition-all duration-300">
      
      {/* Logo */}
      <div className="mb-6 flex justify-center">
        <Image
          src="/images/logos/logoApp.png"
          width={150}
          height={150}
          alt="Logo da Empresa"
          className="w-10 h-10 md:w-32 md:h-32 rounded-md"
        />
      </div>

      {/* Navegação */}
      <Nav />

      {/* Saudação */}
      <div className="mt-6 mb-4 text-center md:text-left hidden md:block">
        <h1 className="text-lg font-semibold">Bem-vindo, {session.user.name}</h1>
        {session.user.role && (
          <p className="text-sm text-gray-400"> {session.user.role} </p>
        )}
      </div>

      <div className="flex-grow" />

      {/* Botão de logout */}
      <button
        onClick={() => signOut()}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V5m0 14a9 9 0 100-18 9 9 0 000 18z"
          />
        </svg>
        <span className="hidden md:inline">Sair</span>
      </button>
    </aside>
  );
}
