import type { Metadata } from 'next';

/**
 * Layout dos dispositivos de recepção (totem e, depois, telão).
 *
 * Existe separado do grupo `(public)` de propósito: aquele layout injeta Navbar,
 * Footer e Google Analytics em toda página, e um quiosque roda em tela cheia, sem
 * navegação institucional. O root layout já fornece <html>/<body>.
 *
 * `select-none` e `touch-action: manipulation` evitam seleção de texto e o zoom
 * por duplo toque, que atrapalham o toque na tela.
 */
export const metadata: Metadata = {
  title: 'Atendimento',
  robots: { index: false, follow: false },
};

export default function KioskLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen select-none bg-slate-950 text-white [touch-action:manipulation]">
      {children}
    </div>
  );
}
