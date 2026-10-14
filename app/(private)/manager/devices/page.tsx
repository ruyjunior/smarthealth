import { Metadata } from 'next';
import ListPageShell from '@/app/components/ui/list-page-shell';
import { fetchDevices } from '@/app/domains/devices/queries';
import { requireManagerClinicId } from '@/app/lib/session';
import DeviceForm from './components/create-form';
import DevicesTable from './components/table';

export const metadata: Metadata = {
  title: 'Atendimento',
};

export default async function Page() {
  const idclinic = await requireManagerClinicId();
  const devices = await fetchDevices(idclinic);

  return (
    <ListPageShell
      breadcrumbs={[
        { label: 'Gerência', href: '/manager' },
        { label: 'Atendimento', href: '/manager/devices', active: true },
      ]}
      eyebrow="Gerência"
      title="Atendimento"
      subtitle="Pareie o totem da recepção e o telão de chamadas. Cada dispositivo recebe um código curto próprio, que identifica a clínica."
    >
      <div className="mx-auto mt-6 grid max-w-7xl gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <DeviceForm />
        <DevicesTable devices={devices} />
      </div>
    </ListPageShell>
  );
}
