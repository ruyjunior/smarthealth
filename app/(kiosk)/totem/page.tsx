import { fetchClinicById } from '@/app/domains/clinics/queries';
import { fetchTypes } from '@/app/domains/types/queries';
import { requireDeviceClinic } from '@/app/lib/device-session';
import TotemFlow from './components/totem-flow';

// A fila muda a cada senha emitida e a página depende do cookie do dispositivo:
// nada aqui pode ser pré-renderizado.
export const dynamic = 'force-dynamic';

export default async function Page() {
  const device = await requireDeviceClinic('totem');

  const [clinic, services] = await Promise.all([
    fetchClinicById(device.idclinic),
    fetchTypes(device.idclinic),
  ]);

  return (
    <TotemFlow
      clinicTitle={clinic?.title ?? ''}
      clinicLogo={clinic?.logourl ?? null}
      deviceLabel={device.label}
      services={services.map(({ id, title, description }) => ({ id, title, description }))}
    />
  );
}
