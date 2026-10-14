import { Metadata } from 'next';
import ListPageShell from '@/app/components/ui/list-page-shell';
import { fetchOffices } from '@/app/domains/offices/queries';
import { fetchQueueByDay } from '@/app/domains/queues/queries';
import { clinicDay } from '@/app/lib/day';
import { getCurrentClinicId } from '@/app/lib/session';
import AutoRefresh from './components/auto-refresh';
import CallNext from './components/call-next';
import QueueBoard from './components/queue-board';

export const metadata: Metadata = {
  title: 'Atendimento',
};

export default async function Page() {
  const idclinic = await getCurrentClinicId();
  const day = clinicDay();

  const [tickets, offices] = await Promise.all([
    fetchQueueByDay(idclinic, day),
    fetchOffices(idclinic),
  ]);

  return (
    <ListPageShell
      breadcrumbs={[{ label: 'Atendimento', href: '/fila', active: true }]}
      eyebrow="Recepção"
      title="Fila do dia"
      subtitle="Chame o próximo paciente, acompanhe a espera e encerre os atendimentos do dia."
    >
      {/* A fila recebe senhas novas do totem o tempo todo: sem isto, a tela
          mostraria apenas o que existia quando foi aberta. */}
      <AutoRefresh />

      <div className="mx-auto mt-6 max-w-7xl">
        <CallNext offices={offices.map(({ id, title }) => ({ id, title }))} />
      </div>

      <QueueBoard tickets={tickets} />
    </ListPageShell>
  );
}
