"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function ConfirmPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || password.length < 6) {
      setError("Token inválido ou senha muito curta.");
      return;
    }

    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Erro ao definir senha.");
      return;
    }

    alert("Senha cadastrada com sucesso!");
    router.push("/login");
  };

  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="max-w-md mx-auto mt-10 p-6 shadow-md rounded-md">
        <h2 className="text-2xl font-semibold mb-4">
          Definir nova senha
        </h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Nova senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            {loading ? "Salvando..." : "Definir senha"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfirmPassword />
    </Suspense>
  );
}