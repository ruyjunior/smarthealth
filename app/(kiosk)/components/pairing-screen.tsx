import Link from 'next/link';
import { deviceHomePath } from '@/app/lib/device';
import { getDeviceSession } from '@/app/lib/device-session';
import { unpairDeviceAction } from '@/app/domains/devices/actions';
import PairDeviceForm from './pair-device-form';

const KIND_LABEL: Record<string, string> = { totem: 'Totem', painel: 'Telão' };

/**
 * Tela de pareamento compartilhada por `/tv` e `/totem/parear`.
 *
 * É pública de propósito: é justamente aqui que um dispositivo ainda sem
 * credencial troca o código curto pela sessão que `requireDeviceClinic` usa
 * depois. O código só é emitido em Gerência > Atendimento.
 */
export default async function PairingScreen() {
  const device = await getDeviceSession();

  if (device) {
    const home = deviceHomePath(device.kind);

    return (
      <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center px-4 py-10">
        <div className="rounded-3xl border border-emerald-400/40 bg-emerald-500/10 p-8 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-emerald-200">Dispositivo pareado</p>
          <p className="mt-3 text-3xl font-extrabold">{device.label}</p>
          <p className="mt-1 text-sm text-slate-300">
            Tipo: {KIND_LABEL[device.kind] ?? device.kind}
          </p>

          {home ? (
            <Link
              href={home}
              className="mt-8 inline-flex w-full items-center justify-center rounded-2xl bg-blue-600 px-6 py-4 text-lg font-bold transition hover:bg-blue-500"
            >
              {device.kind === 'painel' ? 'Abrir o telão' : 'Abrir o totem'}
            </Link>
          ) : null}

          <form action={unpairDeviceAction} className="mt-3">
            <button
              type="submit"
              className="w-full rounded-2xl border border-white/20 px-6 py-4 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
            >
              Desparelhar este dispositivo
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center px-4 py-10">
      <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8">
        <h1 className="text-2xl font-extrabold">Parear este dispositivo</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          Peça a quem administra a clínica um código de pareamento em{' '}
          <span className="font-semibold text-white">Gerência &gt; Atendimento</span> e digite-o
          abaixo. O código vale 15 minutos, serve uma única vez e é ele que identifica a clínica
          deste dispositivo.
        </p>

        <PairDeviceForm />
      </div>
    </div>
  );
}
