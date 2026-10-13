import { lusitana } from './fonts';
import { formatUpdatedAt, hasPendingLegalData } from '@/app/lib/legal-info';

export type LegalSectionInfo = {
  id: string;
  title: string;
};

/**
 * Índice de âncoras dos documentos legais. Aparece como sidebar fixa no desktop
 * e como bloco recolhível acima do conteúdo no mobile.
 */
function LegalIndex({ sections, className }: { sections: LegalSectionInfo[]; className?: string }) {
  return (
    <nav aria-label="Índice" className={className}>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Índice</p>
      <ul className="mt-3 space-y-2">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className="text-sm font-medium text-slate-600 transition hover:text-blue-700"
            >
              {section.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/**
 * Casca compartilhada das páginas legais públicas (Política de Privacidade e
 * Termos de Uso): cabeçalho em gradiente, índice de âncoras e pilha de seções.
 */
export default function LegalPage({
  eyebrow,
  title,
  subtitle,
  sections,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  sections: LegalSectionInfo[];
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-16 pt-28">
      <div className="rounded-[2rem] border border-blue-100 bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-900 p-6 shadow-[0_25px_80px_rgba(37,99,235,0.18)]">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-200">{eyebrow}</p>
        <h1 className={`${lusitana.className} mt-2 text-3xl font-extrabold text-white`}>{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-blue-100">{subtitle}</p>
        <p className="mt-3 text-xs text-blue-200">Última atualização: {formatUpdatedAt()}</p>
      </div>

      {hasPendingLegalData() && (
        <p className="mt-6 rounded-[1.5rem] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Este documento ainda precisa dos dados do fornecedor e de revisão jurídica antes de ser
          publicado. Os campos marcados como TODO: em app/lib/legal-info.ts são exibidos
          literalmente nesta página, e este aviso desaparece automaticamente quando todos forem
          preenchidos.
        </p>
      )}

      <details className="mt-6 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(148,163,184,0.12)] lg:hidden">
        <summary className="cursor-pointer text-sm font-semibold text-slate-700">
          Índice do documento
        </summary>
        <LegalIndex sections={sections} className="mt-3" />
      </details>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start">
        <LegalIndex
          sections={sections}
          className="hidden shrink-0 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(148,163,184,0.12)] lg:sticky lg:top-24 lg:block lg:w-72"
        />

        <div className="flex w-full max-w-4xl flex-col gap-4">{children}</div>
      </div>
    </div>
  );
}

/**
 * Seção numerada de um documento legal. A tipografia do conteúdo é aplicada
 * pelo container, então as páginas podem usar `<p>`, `<ul>`, `<ol>`, `<strong>`
 * e `<a>` sem classes próprias.
 */
export function LegalSection({
  id,
  heading,
  children,
}: {
  id: string;
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-28 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(148,163,184,0.12)] md:p-6"
    >
      <h2 className={`${lusitana.className} text-xl font-bold text-slate-800`}>{heading}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-600 [&_a]:font-semibold [&_a]:text-blue-700 [&_a]:underline [&_li]:ml-1 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5 [&_strong]:text-slate-700 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}
