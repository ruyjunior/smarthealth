'use client';

import { useState, useTransition } from 'react';
import { ArrowPathIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { DeleteAction } from '@/app/components/ui/action-icon';
import { PAIRING_CODE_TTL_MINUTES } from '@/app/lib/device';
import { deleteDevice, regeneratePairingCode, revokeDevice } from '@/app/domains/devices/actions';

export function RevokeDevice({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => revokeDevice(id))}
      className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 transition hover:border-amber-300 hover:bg-amber-100 disabled:opacity-50"
      title="Interrompe o acesso deste dispositivo sem apagar o histórico"
    >
      {isPending ? 'Revogando...' : 'Revogar'}
    </button>
  );
}

/** Emite um código novo e mostra-o uma única vez, ao lado do botão. */
export function NewPairingCode({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ pairingCode: string; expiresInMinutes: number } | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    setError(null);
    setCopied(false);

    startTransition(async () => {
      const response = await regeneratePairingCode(id);

      if (response.pairingCode) {
        setResult({
          pairingCode: response.pairingCode,
          expiresInMinutes: response.expiresInMinutes ?? PAIRING_CODE_TTL_MINUTES,
        });
        setError(null);
      } else {
        setResult(null);
        setError(response.message ?? 'Não foi possível gerar o código.');
      }
    });
  };

  const copy = async () => {
    if (!result) {
      return;
    }

    try {
      await navigator.clipboard.writeText(result.pairingCode);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        disabled={isPending}
        onClick={generate}
        className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-100 disabled:opacity-50"
        title="Gera um código novo para este dispositivo"
      >
        <ArrowPathIcon className="h-4 w-4" />
        {isPending ? 'Gerando...' : 'Novo código'}
      </button>

      {result && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-right">
          <p className="font-mono text-xl font-bold tracking-[0.2em] text-slate-800">
            {result.pairingCode}
          </p>
          <p className="mt-1 text-[11px] text-slate-600">
            aparece uma única vez · vale {result.expiresInMinutes} min
          </p>
          <button
            type="button"
            onClick={copy}
            className="mt-2 inline-flex items-center gap-1 rounded-lg bg-amber-600 px-2 py-1 text-[11px] font-semibold text-white transition hover:bg-amber-500"
          >
            <ClipboardDocumentIcon className="h-3 w-3" />
            {copied ? 'Copiado' : 'Copiar'}
          </button>
        </div>
      )}

      {error && <p className="text-[11px] font-semibold text-red-600">{error}</p>}
    </div>
  );
}

export function DeleteDevice({ id }: { id: string }) {
  return (
    <DeleteAction action={deleteDevice.bind(null, id)} label="Segure para excluir dispositivo" />
  );
}
