import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, LifeBuoy } from 'lucide-react';
import ListPageShell from '@/app/components/ui/list-page-shell';
import { isManager } from '@/app/lib/roles';
import { requireSessionUser } from '@/app/lib/session';
import TopicIcon from '@/app/components/ui/help-topic-icon';
import { listHelpTopics } from '@/app/lib/help-topics';

export const metadata: Metadata = {
  title: 'Ajuda',
};

export default async function Page() {
  const user = await requireSessionUser();
  const topics = listHelpTopics(isManager(user.role));

  return (
    <ListPageShell
      breadcrumbs={[{ label: 'Ajuda', href: '/help', active: true }]}
      eyebrow="Ajuda"
      title="Central de Ajuda"
      subtitle="Aprenda a usar o app passo a passo. Cada card abre um guia curto, com o caminho na tela e dicas de uso."
    >
      <div className="mx-auto mt-6 grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {topics.map((topic) => (
          <Link
            key={topic.slug}
            href={`/help/${topic.slug}`}
            aria-label={`Abrir guia: ${topic.title}`}
            className="group flex flex-col gap-3 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(148,163,184,0.12)] transition-all duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_25px_70px_rgba(37,99,235,0.12)]"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-100">
              <TopicIcon name={topic.icon} />
            </span>
            <span className="text-base font-bold text-slate-800">{topic.title}</span>
            <span className="text-sm leading-relaxed text-slate-500">{topic.summary}</span>
            <span className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-semibold text-blue-600">
              Ler o guia
              <ArrowRight size={16} />
            </span>
          </Link>
        ))}
      </div>

      <div className="mx-auto mt-6 max-w-7xl rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(148,163,184,0.12)] md:p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <LifeBuoy size={20} />
          </span>
          <h2 className="text-base font-bold text-slate-800">Como usar esta central</h2>
        </div>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-slate-600">
          <li>Cada card abre um guia com os passos da funcionalidade e dicas do dia a dia.</li>
          <li>No fim de cada guia há um atalho para abrir a tela do app e ir direto ao assunto.</li>
          <li>
            Você também chega aqui pelo item <strong>Ajuda</strong> do menu lateral, em qualquer
            tela do app.
          </li>
        </ul>
      </div>
    </ListPageShell>
  );
}
