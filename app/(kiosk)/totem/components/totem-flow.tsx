'use client';

import { useActionState, useCallback, useEffect, useRef, useState, useTransition } from 'react';
import {
  ArrowPathIcon,
  BackspaceIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
  TicketIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import Logo from '@/app/components/ui/logo';
import Loading from '@/app/components/ui/loading';
import { issueTicket, type State } from '@/app/domains/queues/actions';
import { isValidCpf } from '@/app/lib/cpf';
import { maskCpf } from '@/app/lib/lgpd';
import { formatCPF } from '@/app/lib/utils';

type Step = 'cpf' | 'service' | 'confirm' | 'ticket';

type Service = { id: string; title: string; description: string };

/** Devolve o quiosque ao início para o próximo paciente não ver o CPF do anterior. */
const IDLE_RESET_MS = 60_000;
/** Tempo que a senha fica na tela antes de liberar o totem. */
const TICKET_RESET_MS = 20_000;

const KEYPAD = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

export default function TotemFlow({
  clinicTitle,
  clinicLogo,
  deviceLabel,
  services,
}: {
  clinicTitle: string;
  clinicLogo: string | null;
  deviceLabel: string;
  services: Service[];
}) {
  const [step, setStep] = useState<Step>('cpf');
  const [digits, setDigits] = useState('');
  const [service, setService] = useState<Service | null>(null);
  const [priority, setPriority] = useState(false);
  const [idleTick, setIdleTick] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [state, formAction] = useActionState<State, FormData>(issueTicket, {});
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const shownTicketRef = useRef<string | null>(null);

  const reset = useCallback(() => {
    setStep('cpf');
    setDigits('');
    setService(null);
    setPriority(false);
    setMessage(null);
  }, []);

  useEffect(() => {
    const ticket = state.ticket;

    if (ticket && ticket.code !== shownTicketRef.current) {
      shownTicketRef.current = ticket.code;
      setMessage(null);
      setStep('ticket');
    }
  }, [state.ticket]);

  useEffect(() => {
    if (state.message && !state.ticket) {
      setMessage(state.message);
    }
  }, [state.message, state.ticket]);

  useEffect(() => {
    if (step === 'ticket') {
      return;
    }

    const timer = setTimeout(reset, IDLE_RESET_MS);
    return () => clearTimeout(timer);
  }, [step, idleTick, reset]);

  useEffect(() => {
    if (step !== 'ticket') {
      return;
    }

    const timer = setTimeout(reset, TICKET_RESET_MS);
    return () => clearTimeout(timer);
  }, [step, reset]);

  const pushDigit = (digit: string) => {
    setMessage(null);
    setDigits((previous) => (previous.length >= 11 ? previous : previous + digit));
  };

  const confirmCpf = () => {
    if (!isValidCpf(digits)) {
      setMessage('CPF inválido. Confira os números e tente novamente.');
      return;
    }

    setMessage(null);
    setStep('service');
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formRef.current || !service) {
      return;
    }

    startTransition(() => formAction(new FormData(formRef.current!)));
  };

  return (
    <div
      className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-4 py-6 sm:px-6"
      onPointerDown={() => setIdleTick((tick) => tick + 1)}
    >
      <header className="flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 px-5 py-4">
        <div className="flex items-center gap-4">
          <Logo src={clinicLogo} alt={clinicTitle || 'Clínica'} size="lg" priority />
          <div>
            <p className="text-lg font-extrabold sm:text-xl">{clinicTitle || 'Atendimento'}</p>
            <p className="text-xs text-slate-400">Totem: {deviceLabel}</p>
          </div>
        </div>
        <p className="hidden text-right text-sm text-slate-300 sm:block">
          Toque nos números e siga as instruções
        </p>
      </header>

      <main className="flex flex-1 flex-col justify-center py-6">
        {services.length === 0 ? (
          <div className="rounded-3xl border border-amber-300/40 bg-amber-400/10 p-8 text-center">
            <p className="text-2xl font-bold">Nenhum serviço disponível</p>
            <p className="mt-3 text-slate-200">
              Não há serviços cadastrados para esta clínica no momento. Procure a recepção.
            </p>
          </div>
        ) : (
          <>
            {step === 'ticket' && state.ticket ? (
              <section
                aria-live="polite"
                className="rounded-3xl border border-emerald-400/40 bg-emerald-500/10 p-8 text-center"
              >
                <CheckCircleIcon className="mx-auto h-16 w-16 text-emerald-400" />
                <p className="mt-4 text-xl font-semibold text-emerald-100">
                  {state.ticket.patientName
                    ? `Senha emitida, ${state.ticket.patientName}`
                    : 'Senha emitida'}
                </p>
                <p className="mt-6 text-sm uppercase tracking-[0.3em] text-slate-300">Sua senha</p>
                <p className="font-mono text-7xl font-black tracking-wider text-white sm:text-8xl">
                  {state.ticket.code}
                </p>

                {state.ticket.priority && (
                  <p className="mt-4 inline-flex rounded-full bg-amber-400/20 px-4 py-1 text-sm font-semibold text-amber-200">
                    Atendimento preferencial
                  </p>
                )}

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Sua posição</p>
                    <p className="mt-1 text-3xl font-bold">{state.ticket.position}º</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      Espera estimada
                    </p>
                    <p className="mt-1 text-3xl font-bold">
                      {state.ticket.estimatedWaitMinutes} min
                    </p>
                  </div>
                </div>

                <p className="mt-8 text-lg text-slate-200">
                  Aguarde na recepção: você será chamado pelo telão.
                </p>

                <button
                  type="button"
                  onClick={reset}
                  className="mt-8 inline-flex items-center gap-2 rounded-2xl border border-white/20 px-6 py-4 text-base font-semibold text-white transition hover:bg-white/10"
                >
                  <ArrowPathIcon className="h-5 w-5" />
                  Emitir nova senha
                </button>
              </section>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-6">
                <input type="hidden" name="cpf" value={digits} readOnly />
                <input type="hidden" name="idtype" value={service?.id ?? ''} readOnly />
                <input type="hidden" name="priority" value={priority ? 'on' : ''} readOnly />

                {step === 'cpf' && (
                  <section className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
                    <h1 className="flex items-center gap-3 text-2xl font-bold">
                      <UserCircleIcon className="h-8 w-8 text-blue-300" />
                      Digite seu CPF
                    </h1>

                    <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/70 px-6 py-5 text-center">
                      <p className="font-mono text-4xl font-bold tracking-widest sm:text-5xl">
                        {formatCPF(digits) || '000.000.000-00'}
                      </p>
                      <p className="mt-2 text-xs text-slate-400">{digits.length} de 11 dígitos</p>
                    </div>

                    <div className="mt-6 grid grid-cols-3 gap-3">
                      {KEYPAD.map((digit) => (
                        <button
                          key={digit}
                          type="button"
                          onClick={() => pushDigit(digit)}
                          className="h-20 rounded-2xl border border-white/10 bg-white/5 text-3xl font-bold transition active:scale-95 active:bg-blue-600/40 sm:h-24"
                        >
                          {digit}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setDigits('')}
                        className="h-20 rounded-2xl border border-white/10 bg-white/5 text-base font-semibold text-slate-200 transition active:scale-95 active:bg-white/10 sm:h-24"
                      >
                        Limpar
                      </button>
                      <button
                        type="button"
                        onClick={() => pushDigit('0')}
                        className="h-20 rounded-2xl border border-white/10 bg-white/5 text-3xl font-bold transition active:scale-95 active:bg-blue-600/40 sm:h-24"
                      >
                        0
                      </button>
                      <button
                        type="button"
                        onClick={() => setDigits((previous) => previous.slice(0, -1))}
                        aria-label="Apagar último dígito"
                        className="flex h-20 items-center justify-center rounded-2xl border border-white/10 bg-white/5 transition active:scale-95 active:bg-white/10 sm:h-24"
                      >
                        <BackspaceIcon className="h-8 w-8" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={confirmCpf}
                      disabled={digits.length !== 11}
                      className="mt-6 w-full rounded-2xl bg-blue-600 px-6 py-5 text-xl font-bold transition hover:bg-blue-500 disabled:opacity-40"
                    >
                      Continuar
                    </button>
                  </section>
                )}

                {step === 'service' && (
                  <section className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
                    <h1 className="flex items-center gap-3 text-2xl font-bold">
                      <CalendarDaysIcon className="h-8 w-8 text-blue-300" />
                      Escolha o serviço
                    </h1>
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      {services.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setService(item);
                            setMessage(null);
                            setStep('confirm');
                          }}
                          className="flex min-h-28 flex-col items-start justify-center rounded-2xl border border-white/10 bg-white/5 p-5 text-left transition active:scale-[0.98] active:bg-blue-600/40"
                        >
                          <span className="text-xl font-bold">{item.title}</span>
                          {item.description && (
                            <span className="mt-1 text-sm text-slate-300">{item.description}</span>
                          )}
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep('cpf')}
                      className="mt-6 w-full rounded-2xl border border-white/20 px-6 py-4 text-base font-semibold transition hover:bg-white/10"
                    >
                      Voltar
                    </button>
                  </section>
                )}

                {step === 'confirm' && service && (
                  <section className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
                    <h1 className="flex items-center gap-3 text-2xl font-bold">
                      <TicketIcon className="h-8 w-8 text-blue-300" />
                      Confirmar
                    </h1>

                    <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                        <dt className="text-xs uppercase tracking-[0.2em] text-slate-400">CPF</dt>
                        {/* Tela compartilhada: só os dois últimos dígitos aparecem. */}
                        <dd className="mt-1 font-mono text-2xl font-bold">{maskCpf(digits)}</dd>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                        <dt className="text-xs uppercase tracking-[0.2em] text-slate-400">
                          Serviço
                        </dt>
                        <dd className="mt-1 text-2xl font-bold">{service.title}</dd>
                      </div>
                    </dl>

                    <button
                      type="button"
                      onClick={() => setPriority((current) => !current)}
                      aria-pressed={priority}
                      className={`mt-5 w-full rounded-2xl border p-5 text-left transition ${
                        priority
                          ? 'border-amber-300 bg-amber-400/20'
                          : 'border-white/15 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <span className="block text-lg font-bold">
                        {priority ? 'Preferencial marcado' : 'Precisa de atendimento preferencial?'}
                      </span>
                      <span className="mt-1 block text-sm text-slate-300">
                        Idosos (60+), gestantes, lactantes e pessoas com deficiência têm prioridade
                        garantida por lei.
                      </span>
                    </button>

                    <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_2fr]">
                      <button
                        type="button"
                        onClick={() => setStep('service')}
                        className="rounded-2xl border border-white/20 px-6 py-5 text-base font-semibold transition hover:bg-white/10"
                      >
                        Voltar
                      </button>
                      <button
                        type="submit"
                        disabled={isPending}
                        className="rounded-2xl bg-emerald-600 px-6 py-5 text-xl font-bold transition hover:bg-emerald-500 disabled:opacity-50"
                      >
                        {isPending ? 'Emitindo senha...' : 'Emitir senha'}
                      </button>
                    </div>
                  </section>
                )}

                {isPending && (
                  <div className="rounded-2xl border border-white/10 bg-slate-900/50">
                    <Loading />
                  </div>
                )}
              </form>
            )}

            {message && (
              <p
                aria-live="polite"
                className="mt-5 rounded-2xl border border-red-400/40 bg-red-500/10 px-5 py-4 text-center text-base font-semibold text-red-100"
              >
                {message}
              </p>
            )}
          </>
        )}
      </main>

      <footer className="flex items-center justify-center gap-2 pb-2 text-xs text-slate-500">
        <ClockIcon className="h-4 w-4" />A tela volta ao início automaticamente
      </footer>
    </div>
  );
}
