import Link from 'next/link';
import { CircleHelp } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-2 py-10 text-center">
      <CircleHelp className="h-10 w-10 text-gray-400" />
      <h2 className="text-xl font-semibold text-slate-800">Guia não encontrado</h2>
      <p className="text-sm text-slate-500">
        Este guia não existe ou não está disponível para o seu perfil de acesso.
      </p>
      <Link
        href="/help"
        className="mt-4 rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
      >
        Voltar para a Central de Ajuda
      </Link>
    </main>
  );
}
