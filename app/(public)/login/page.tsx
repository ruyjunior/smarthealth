"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/login-form";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    if (!email || !password) return;
    //console.log(email);
    const res = await fetch('/api/auth/login', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    console.log(data);
    console.log(res.ok);
    if (res.ok) {
      localStorage.setItem("token", data.token); // Salva o token no localStorage
      router.push("/dashboard"); // Redireciona após login bem-sucedido
    } else {
      setMessage(data.message);
    }
  };

  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="max-w-md mx-auto mt-10 p-6 bg-black shadow-md rounded-md">
        <LoginForm />
      </div>
    </main>
  );
}
