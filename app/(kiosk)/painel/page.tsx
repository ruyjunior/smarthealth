import { fetchClinicById } from '@/app/domains/clinics/queries';
import { fetchPanelCalls, fetchPanelNext } from '@/app/domains/queues/queries';
import { clinicDay } from '@/app/lib/day';
import { requireDeviceClinic } from '@/app/lib/device-session';
import PanelBoard from './components/panel-board';

// As chamadas mudam durante o dia inteiro: o telão nunca pode ser pré-renderizado.
export const dynamic = 'force-dynamic';

export default async function Page() {
  const device = await requireDeviceClinic('painel');
  const day = clinicDay();

  const [clinic, calls, next] = await Promise.all([
    fetchClinicById(device.idclinic),
    fetchPanelCalls(device.idclinic, day),
    fetchPanelNext(device.idclinic, day),
  ]);

  return (
    <PanelBoard
      clinicTitle={clinic?.title ?? ''}
      clinicLogo={clinic?.logourl ?? null}
      deviceLabel={device.label}
      calls={calls}
      next={next}
    />
  );
}
