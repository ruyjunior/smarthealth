import type { Device } from '@/app/domains/devices/types';
import type { DeviceKind } from '@/app/lib/device';
import { DeleteDevice, NewPairingCode, RevokeDevice } from './buttons';

const KIND_LABEL: Record<DeviceKind, string> = { totem: 'Totem', painel: 'Telão' };

function status(device: Device) {
  if (device.revokedat) {
    return { label: 'Revogado', tone: 'border-red-200 bg-red-50 text-red-700' };
  }

  if (!device.hassession) {
    return {
      label: 'Aguardando pareamento',
      tone: 'border-slate-200 bg-slate-50 text-slate-600',
    };
  }

  return { label: 'Pareado', tone: 'border-emerald-200 bg-emerald-50 text-emerald-700' };
}

/** Código pendente que ainda não expirou: vale a pena mostrar até quando serve. */
function pendingCode(device: Device) {
  if (device.hassession || device.revokedat || !device.pairingexpiresat) {
    return null;
  }

  const expires = new Date(device.pairingexpiresat);
  const minutesLeft = Math.ceil((expires.getTime() - Date.now()) / 60_000);

  return minutesLeft > 0
    ? `código válido por ${minutesLeft} min`
    : 'código expirado — gere um novo';
}

export default function DevicesTable({ devices }: { devices: Device[] }) {
  return (
    <div className="rounded-[1.5rem] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-3 shadow-[0_25px_80px_rgba(59,130,246,0.08)] md:p-5">
      {devices.length === 0 ? (
        <p className="p-4 text-sm text-slate-600">
          Nenhum dispositivo cadastrado. Gere um código para parear o totem da recepção.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {devices.map((device) => {
            const badge = status(device);
            const code = pendingCode(device);

            return (
              <li
                key={device.id}
                className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-bold text-slate-800">{device.label}</p>
                  <p className="text-xs text-slate-500">{KIND_LABEL[device.kind] ?? device.kind}</p>
                  <span
                    className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${badge.tone}`}
                  >
                    {badge.label}
                  </span>
                  {code && <p className="mt-2 text-xs text-amber-700">{code}</p>}
                </div>

                <div className="flex items-center gap-2">
                  {!device.revokedat && (
                    <>
                      {!device.hassession && <NewPairingCode id={device.id} />}
                      <RevokeDevice id={device.id} />
                    </>
                  )}
                  <DeleteDevice id={device.id} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
