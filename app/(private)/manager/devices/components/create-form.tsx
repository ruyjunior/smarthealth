'use client';

import { useActionState, useTransition } from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import Loading from '@/app/components/ui/loading';
import { createDevice, type State } from '@/app/domains/devices/actions';
import { DEVICE_KINDS, devicePairingHintPath, type DeviceKind } from '@/app/lib/device';

const KIND_LABEL: Record<DeviceKind, string> = {
  totem: 'Totem (recepção)',
  painel: 'Telão (sala de espera)',
};

export default function DeviceForm() {
  const [state, formAction] = useActionState<State, FormData>(createDevice, {});
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(() => formAction(new FormData(event.currentTarget)));
  };

  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(148,163,184,0.12)]">
      <h2 className="text-lg font-bold text-slate-800">Novo dispositivo</h2>

      {state.created && (
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <CheckCircleIcon className="h-6 w-6 shrink-0 text-amber-600" />
            <div className="min-w-0">
              <p className="font-semibold text-slate-800">
                {state.created.label} criado — {KIND_LABEL[state.created.kind]}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Este código aparece <strong>uma única vez</strong> e vale por{' '}
                {state.created.expiresInMinutes} minutos (só o hash dele fica guardado).{' '}
                {state.created.kind === 'painel' ? 'No telão' : 'No totem'}, abra{' '}
                <span className="font-mono">{devicePairingHintPath(state.created.kind)}</span> e
                digite o código — depois do pareamento ele já abre a própria tela.
              </p>

              <p className="mt-3 rounded-xl border border-amber-200 bg-white p-4 text-center font-mono text-3xl font-bold tracking-[0.25em] text-slate-800">
                {state.created.pairingCode}
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-4">
        {isPending ? (
          <Loading />
        ) : (
          <>
            <label htmlFor="label" className="mb-2 block text-sm font-medium text-slate-700">
              Identificação
            </label>
            <input
              id="label"
              name="label"
              required
              placeholder="Ex.: Totem da recepção"
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="label-error"
            />
            <div id="label-error" aria-live="polite" aria-atomic="true">
              {state.errors?.label?.map((error) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
            </div>

            <fieldset className="mt-4">
              <legend className="mb-2 block text-sm font-medium text-slate-700">Tipo</legend>
              <div className="flex flex-col gap-2">
                {DEVICE_KINDS.map((kind, index) => (
                  <label
                    key={kind}
                    className="flex items-center gap-3 rounded-xl border border-gray-200 px-3 py-2 text-sm"
                  >
                    <input
                      type="radio"
                      name="kind"
                      value={kind}
                      defaultChecked={index === 0}
                      required
                    />
                    {KIND_LABEL[kind]}
                  </label>
                ))}
              </div>
              <div aria-live="polite" aria-atomic="true">
                {state.errors?.kind?.map((error) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
              </div>
            </fieldset>

            <button
              type="submit"
              className="mt-5 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:from-blue-500 hover:to-indigo-500"
            >
              Gerar código de pareamento
            </button>

            {state.message && (
              <p aria-live="polite" className="mt-3 text-sm font-semibold text-red-500">
                {state.message}
              </p>
            )}
          </>
        )}
      </form>
    </div>
  );
}
