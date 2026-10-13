import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import TopicIcon from '@/app/components/ui/help-topic-icon';
import { listSiteGuides } from '@/app/lib/help-topics';

/**
 * Mostra, antes do login, os mesmos guias da Central de Ajuda: cada cartão abre
 * o passo a passo da tarefa, sem depender de sessão.
 */
const Guides = () => {
  const guides = listSiteGuides();

  return (
    <section id="guides" className="relative scroll-mt-24 py-24 text-center">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-white to-blue-50" />

      <div className="relative mx-auto max-w-7xl px-6">
        <span className="mb-5 inline-flex items-center rounded-full border border-blue-200 bg-blue-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
          Como funciona
        </span>

        <h2 className="mb-5 text-3xl font-extrabold text-blue-900 sm:text-4xl lg:text-5xl">
          Veja como é simples usar o Smart Health
        </h2>

        <p className="mx-auto mb-12 max-w-3xl text-base text-slate-600 sm:text-lg">
          Abra cada guia e acompanhe o passo a passo das tarefas do dia a dia da clínica, do
          agendamento ao orçamento em PDF.
        </p>

        <div className="grid gap-6 text-left md:grid-cols-2 xl:grid-cols-3">
          {guides.map((topic, index) => (
            <details
              key={topic.slug}
              open={index === 0}
              className="group rounded-[1.75rem] border border-blue-100 bg-white p-6 shadow-[0_18px_50px_rgba(30,64,175,0.08)] transition-all duration-300 hover:border-blue-200 hover:shadow-[0_25px_70px_rgba(30,64,175,0.14)]"
            >
              <summary className="flex cursor-pointer list-none items-start gap-4 [&::-webkit-details-marker]:hidden">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-inner shadow-blue-100">
                  <TopicIcon name={topic.icon} size={26} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-lg font-bold text-blue-800">{topic.title}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-slate-600">
                    {topic.summary}
                  </span>
                </span>

                <ChevronDown
                  aria-hidden
                  className="mt-1 h-5 w-5 shrink-0 text-blue-500 transition-transform duration-300 group-open:rotate-180"
                />
              </summary>

              <div className="mt-5 space-y-4 border-t border-blue-100 pt-5">
                {topic.sections.map((section) => (
                  <div key={section.heading}>
                    <h3 className="text-base font-bold text-blue-800">{section.heading}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{section.body}</p>

                    {section.steps && (
                      <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm leading-relaxed text-slate-600">
                        {section.steps.map((step) => (
                          <li key={step}>{step}</li>
                        ))}
                      </ol>
                    )}

                    {section.tips && (
                      <ul className="mt-2 space-y-1 rounded-xl bg-blue-50/70 p-3 text-sm leading-relaxed text-blue-900">
                        {section.tips.map((tip) => (
                          <li key={tip} className="flex gap-1">
                            <span className="font-semibold">Dica:</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </details>
          ))}
        </div>

        <p className="mt-10 text-sm text-slate-500">
          Quem já usa o Smart Health encontra esses e outros guias na Central de Ajuda, dentro do
          app.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/plans"
            className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-blue-500/30 transition-all duration-200 hover:bg-blue-700 active:scale-95"
          >
            Ver planos e preços
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-2xl border border-blue-200 bg-white px-8 py-4 text-lg font-bold text-blue-700 shadow-sm transition-all duration-200 hover:border-blue-300 hover:bg-blue-50"
          >
            Já sou cliente
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Guides;
