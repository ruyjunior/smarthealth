'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/outline';
import Logo from '@/app/components/ui/logo';
import type { PanelCall } from '@/app/domains/queues/types';

const SOUND_KEY = 'sh-panel-sound';
/** O telão precisa reagir rápido: a recepção chama e o paciente já está de pé. */
const REFRESH_MS = 5000;
/** Quanto tempo a chamada nova fica destacada. */
const FLASH_MS = 10000;

/** "A001" falado dígito a dígito sai como "A zero zero um", que é o que o paciente ouve. */
function spokenCall(ticket: PanelCall) {
  const parts = [`Senha ${ticket.code.split('').join(' ')}`];

  if (ticket.patientname) {
    parts.push(patientLabel(ticket));
  }

  if (ticket.officetitle) {
    parts.push(`Sala ${ticket.officetitle}`);
  }

  return parts.join('. ');
}

function patientLabel(ticket: PanelCall) {
  if (!ticket.patientname) {
    return 'Paciente não cadastrado';
  }

  return ticket.patientpronoun
    ? `${ticket.patientpronoun} ${ticket.patientname}`
    : ticket.patientname;
}

function beep() {
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

  if (!Ctor) {
    return;
  }

  const context = new Ctor();
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.frequency.value = 880;
  oscillator.connect(gain);
  gain.connect(context.destination);
  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.2, context.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.35);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.4);
  oscillator.onended = () => void context.close();
}

export default function PanelBoard({
  clinicTitle,
  clinicLogo,
  deviceLabel,
  calls,
  next,
}: {
  clinicTitle: string;
  clinicLogo: string | null;
  deviceLabel: string;
  calls: PanelCall[];
  next: { code: string; priority: boolean }[];
}) {
  const router = useRouter();
  const [now, setNow] = useState('');
  const [soundOn, setSoundOn] = useState(false);
  const [flashing, setFlashing] = useState(false);
  const announcedRef = useRef<string | null>(null);

  const current = calls[0] ?? null;
  const others = calls.slice(1);

  // Assinatura da chamada: a rechamada mantém o mesmo `id`, então o que muda é a
  // hora da última chamada. É isso que faz o telão reanunciar ao ser rechamado.
  const signature = current ? `${current.id}:${current.lastcallat?.getTime() ?? 0}` : null;

  // Relógio só depois de montar: renderizar a hora no servidor divergiria na hidratação.
  useEffect(() => {
    const tick = () =>
      setNow(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));

    tick();
    const timer = setInterval(tick, 20_000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setSoundOn(window.localStorage.getItem(SOUND_KEY) === 'on');
  }, []);

  useEffect(() => {
    const timer = setInterval(() => router.refresh(), REFRESH_MS);
    return () => clearInterval(timer);
  }, [router]);

  const announce = useCallback((ticket: PanelCall) => {
    try {
      beep();
      // O bipe marca o início; a locução entra logo depois para não competir com ele.
      setTimeout(() => {
        if (!('speechSynthesis' in window)) {
          return;
        }

        const utterance = new SpeechSynthesisUtterance(spokenCall(ticket));
        utterance.lang = 'pt-BR';
        utterance.rate = 0.95;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      }, 450);
    } catch {
      // Navegador de TV sem áudio não pode derrubar o telão.
    }
  }, []);

  // Anuncia só chamada nova: a que já estava na tela quando o telão abriu não precisa
  // ser falada outra vez.
  useEffect(() => {
    if (!current || !signature || announcedRef.current === signature) {
      return;
    }

    const isFirstRender = announcedRef.current === null;
    announcedRef.current = signature;

    if (!isFirstRender && soundOn) {
      announce(current);
    }
  }, [current, signature, soundOn, announce]);

  useEffect(() => {
    if (!signature) {
      return;
    }

    setFlashing(true);
    const timer = setTimeout(() => setFlashing(false), FLASH_MS);
    return () => clearTimeout(timer);
  }, [signature]);

  const toggleSound = () => {
    const nextValue = !soundOn;
    setSoundOn(nextValue);
    window.localStorage.setItem(SOUND_KEY, nextValue ? 'on' : 'off');

    // O navegador só libera áudio depois de um gesto do usuário, então este clique
    // é a oportunidade de confirmar que a TV tem som.
    if (nextValue && current) {
      announce(current);
    }
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 p-6 lg:p-10">
      <header className="flex items-center justify-between gap-6 rounded-3xl border border-white/10 bg-white/5 px-6 py-4">
        <div className="flex items-center gap-5">
          <Logo src={clinicLogo} alt={clinicTitle || 'Clínica'} size="lg" priority />
          <div>
            <p className="text-xl font-extrabold lg:text-2xl">{clinicTitle || 'Atendimento'}</p>
            <p className="text-xs text-slate-400">Painel: {deviceLabel}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {now && <p className="font-mono text-2xl font-bold text-slate-200">{now}</p>}
          <button
            type="button"
            onClick={toggleSound}
            aria-pressed={soundOn}
            className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
              soundOn
                ? 'border-emerald-300/40 bg-emerald-400/20 text-emerald-100'
                : 'border-white/20 bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            {soundOn ? (
              <SpeakerWaveIcon className="h-5 w-5" />
            ) : (
              <SpeakerXMarkIcon className="h-5 w-5" />
            )}
            {soundOn ? 'Som ligado' : 'Ativar som'}
          </button>
        </div>
      </header>

      <main className="grid flex-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
        <section
          aria-live="polite"
          className={`flex flex-col justify-center rounded-[2rem] border-2 p-8 text-center transition-colors lg:p-12 ${
            flashing
              ? 'animate-pulse border-emerald-300 bg-emerald-500/20'
              : 'border-white/10 bg-slate-900/60'
          }`}
        >
          {current ? (
            <>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-200">
                {flashing ? 'Nova chamada' : 'Em atendimento'}
              </p>

              <p className="mt-6 font-mono text-8xl font-black leading-none tracking-wider text-white lg:text-[11rem]">
                {current.code}
              </p>

              <p className="mt-8 text-3xl font-bold text-white lg:text-5xl">
                {patientLabel(current)}
              </p>

              <p className="mt-4 text-2xl font-semibold text-blue-200 lg:text-3xl">
                {current.officetitle ? `Sala: ${current.officetitle}` : 'Dirija-se à recepção'}
              </p>

              {current.priority && (
                <p className="mx-auto mt-6 inline-flex rounded-full bg-amber-400/20 px-5 py-2 text-base font-semibold text-amber-200">
                  Atendimento preferencial
                </p>
              )}

              {current.doctorname && (
                <p className="mt-4 text-lg text-slate-300">{current.doctorname}</p>
              )}
            </>
          ) : (
            <>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-400">
                Aguardando chamada
              </p>
              <p className="mt-6 text-5xl font-black text-slate-500 lg:text-7xl">—</p>
              <p className="mt-6 text-xl text-slate-300">
                Nenhuma senha chamada até agora. Aguarde na recepção.
              </p>
            </>
          )}
        </section>

        <aside className="flex flex-col gap-6">
          {others.length > 0 && (
            <section className="rounded-[2rem] border border-white/10 bg-slate-900/60 p-6">
              <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">
                Também chamadas
              </h2>
              <ul className="mt-4 flex flex-col gap-3">
                {others.map((ticket) => (
                  <li
                    key={ticket.id}
                    className="flex items-center justify-between gap-3 rounded-2xl bg-white/5 px-4 py-3"
                  >
                    <span className="font-mono text-3xl font-bold">{ticket.code}</span>
                    <span className="text-right text-sm text-slate-300">
                      {patientLabel(ticket)}
                      {ticket.officetitle && (
                        <span className="block text-slate-400">{ticket.officetitle}</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="rounded-[2rem] border border-white/10 bg-slate-900/60 p-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">
              Próximas senhas
            </h2>

            {next.length === 0 ? (
              <p className="mt-4 text-sm text-slate-400">Ninguém aguardando no momento.</p>
            ) : (
              <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
                {next.map((ticket) => (
                  <li
                    key={ticket.code}
                    className={`rounded-2xl px-4 py-3 text-center font-mono text-3xl font-bold ${
                      ticket.priority
                        ? 'bg-amber-400/20 text-amber-100'
                        : 'bg-white/5 text-slate-200'
                    }`}
                  >
                    {ticket.code}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </aside>
      </main>

      <footer className="pb-2 text-center text-xs text-slate-500">
        A lista de próximas senhas mostra apenas os códigos: quem ainda não foi chamado não tem o
        nome exposto neste painel.
      </footer>
    </div>
  );
}
