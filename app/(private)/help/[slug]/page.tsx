import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ListPageShell from '@/app/components/ui/list-page-shell';
import { lusitana } from '@/app/components/ui/fonts';
import { isManager } from '@/app/lib/roles';
import { requireSessionUser } from '@/app/lib/session';
import { findHelpTopic, helpTopicNeighbours } from '@/app/lib/help-topics';

type HelpTopicPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: HelpTopicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const user = await requireSessionUser();
  const topic = findHelpTopic(slug, isManager(user.role));

  return { title: topic ? topic.title : 'Ajuda' };
}

export default async function Page({ params }: HelpTopicPageProps) {
  const { slug } = await params;
  const user = await requireSessionUser();
  const canManage = isManager(user.role);
  const topic = findHelpTopic(slug, canManage);

  if (!topic) {
    notFound();
  }

  const { previous, next } = helpTopicNeighbours(topic.slug, canManage);

  return (
    <ListPageShell
      breadcrumbs={[
        { label: 'Ajuda', href: '/help' },
        { label: topic.title, href: `/help/${topic.slug}`, active: true },
      ]}
      eyebrow="Ajuda"
      title={topic.title}
      subtitle={topic.summary}
      action={
        topic.path ? (
          <Link
            href={topic.path}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Abrir {topic.title}
          </Link>
        ) : undefined
      }
    >
      <div className="mx-auto mt-6 flex max-w-4xl flex-col gap-4">
        {topic.sections.map((section) => (
          <section
            key={section.heading}
            className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(148,163,184,0.12)] md:p-6"
          >
            <h2 className={`${lusitana.className} text-xl font-bold text-slate-800`}>
              {section.heading}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{section.body}</p>

            {section.steps && (
              <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm leading-relaxed text-slate-600">
                {section.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            )}

            {section.tips && (
              <ul className="mt-3 space-y-1 rounded-xl border border-blue-100 bg-blue-50/60 p-3 text-sm leading-relaxed text-blue-900">
                {section.tips.map((tip) => (
                  <li key={tip} className="flex gap-1">
                    <span className="font-semibold">Dica:</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      <nav
        aria-label="Navegação entre os guias"
        className="mx-auto mt-6 flex max-w-4xl flex-col gap-3 sm:flex-row sm:items-stretch sm:justify-between"
      >
        {previous ? (
          <Link
            href={`/help/${previous.slug}`}
            className="group flex flex-1 items-center gap-3 rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-[0_18px_50px_rgba(148,163,184,0.12)] transition hover:-translate-y-0.5 hover:border-blue-200"
          >
            <ChevronLeft size={20} className="shrink-0 text-blue-600" />
            <span className="min-w-0">
              <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Anterior
              </span>
              <span className="block truncate text-sm font-bold text-slate-800">
                {previous.title}
              </span>
            </span>
          </Link>
        ) : (
          <span className="hidden flex-1 sm:block" />
        )}

        {next ? (
          <Link
            href={`/help/${next.slug}`}
            className="group flex flex-1 items-center justify-end gap-3 rounded-[1.5rem] border border-slate-200 bg-white p-4 text-right shadow-[0_18px_50px_rgba(148,163,184,0.12)] transition hover:-translate-y-0.5 hover:border-blue-200"
          >
            <span className="min-w-0">
              <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Próximo
              </span>
              <span className="block truncate text-sm font-bold text-slate-800">{next.title}</span>
            </span>
            <ChevronRight size={20} className="shrink-0 text-blue-600" />
          </Link>
        ) : (
          <span className="hidden flex-1 sm:block" />
        )}
      </nav>

      <div className="mx-auto mt-4 flex max-w-4xl justify-center">
        <Link href="/help" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
          Voltar para a Central de Ajuda
        </Link>
      </div>
    </ListPageShell>
  );
}
