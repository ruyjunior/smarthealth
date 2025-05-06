'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/app/ui/components/card";
import { Input } from "@/app/ui/components/input";
import { Button } from "@/app/ui/components/button";
import { Label } from "@/app/ui/components/label";
import { useSession } from "next-auth/react";
import { useState } from "react";


export default function ProfileEditform() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    name: session?.user.name || "",
    email: session?.user.email || "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui adicionamos a lógica de atualização dos dados
    console.log("Dados atualizados:", formData);
  };

  return (
    <div className="flex justify-center items-center py-10 px-4">
      <Card className="w-full max-w-2xl shadow-xl border border-gray-200">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">
            Meu Perfil
          </CardTitle>
          <p className="text-center text-sm text-gray-500">
            Atualize suas informações pessoais e senha de acesso.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Digite seu nome"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="password">Nova Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Digite sua nova senha"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Salvar Alterações
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
