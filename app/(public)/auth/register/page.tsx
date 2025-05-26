"use client";

import { useState, useTransition } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();


 const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!email) return;

  startTransition(async () => {
    const res = await fetch("/api/auth/send-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setMessage(data.message);
  });
};

  return (
    <main className="flex items-center justify-center md:h-screen">

      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-center">Redefinir Senha</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            <button
              type="submit"
              aria-disabled={isPending}
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Enviando...
                </span>
              ) : (
                "Enviar link de redefinição de senha"
              )}
            </button>
          </form>
          {message && <p className="mt-4 text-center text-green-600">{message}</p>}
        </div>
      </div>
    </main>
  );
}
