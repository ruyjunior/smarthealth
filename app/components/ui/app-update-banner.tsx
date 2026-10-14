'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SparklesIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { CURRENT_RELEASE, releaseStorageKey } from '@/app/lib/release';

/**
 * Aviso de nova versão exibido dentro do app.
 *
 * Fechar o aviso vale apenas para a versão anunciada (`releaseStorageKey`), então
 * a próxima publicação volta a aparecer — é o que sinaliza que algo mudou.
 */
export default function AppUpdateBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Só depois de montar: ler o localStorage no primeiro render divergiria do HTML
    // gerado no servidor (que nunca tem como saber se o aviso foi fechado).
    setVisible(window.localStorage.getItem(releaseStorageKey(CURRENT_RELEASE)) !== 'dismissed');
  }, []);

  if (!visible) {
    return null;
  }

  const dismiss = () => {
    window.localStorage.setItem(releaseStorageKey(CURRENT_RELEASE), 'dismissed');
    setVisible(false);
  };

  return (
    <div
      role="status"
      className="mb-4 overflow-hidden rounded-[1.5rem] border border-blue-200 bg-gradient-to-r from-blue-50 via-white to-indigo-50 shadow-[0_18px_50px_rgba(148,163,184,0.14)]"
    >
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between md:p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/25">
            <SparklesIcon className="h-5 w-5" />
          </span>

          <div className="min-w-0">
            <p className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-blue-600 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white">
                Novo
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                versão {CURRENT_RELEASE.version}
              </span>
            </p>

            <p className="mt-1 text-base font-bold text-slate-800">{CURRENT_RELEASE.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">{CURRENT_RELEASE.summary}</p>

            <ul className="mt-2 flex flex-wrap gap-2">
              {CURRENT_RELEASE.highlights.map((highlight) => (
                <li
                  key={highlight.title}
                  className="rounded-xl border border-blue-100 bg-white px-3 py-1.5 text-xs text-slate-600"
                  title={highlight.description}
                >
                  <span className="font-semibold text-blue-800">{highlight.title}</span>
                  {' · '}
                  {highlight.description}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 self-end sm:self-center">
          {CURRENT_RELEASE.path && CURRENT_RELEASE.pathLabel && (
            <Link
              href={CURRENT_RELEASE.path}
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:from-blue-500 hover:to-indigo-500"
            >
              {CURRENT_RELEASE.pathLabel}
            </Link>
          )}

          {CURRENT_RELEASE.helpSlug && CURRENT_RELEASE.helpLabel && (
            <Link
              href={`/help/${CURRENT_RELEASE.helpSlug}`}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
            >
              {CURRENT_RELEASE.helpLabel}
            </Link>
          )}

          <button
            type="button"
            onClick={dismiss}
            aria-label="Fechar aviso de novidade"
            title="Fechar aviso de novidade"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
