import { UpdateService, DeleteService } from './buttons';
import { getCurrentClinicId } from '@/app/lib/session';
import { fetchFilteredServices } from '@/app/domains/services/queries';
import { formatDateToLocal, formatTime } from '@/app/lib/utils';
import { fetchClients } from '@/app/domains/clients/queries';
import { fetchOffices } from '@/app/domains/offices/queries';
import { fetchTypes } from '@/app/domains/types/queries';
import { fetchUsers } from '@/app/domains/users/queries';
import StatusBadge from '@/app/components/ui/status-badge';

export default async function ServicesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const idclinic = await getCurrentClinicId();
  const services = await fetchFilteredServices(idclinic, query, currentPage);
  const clients = await fetchClients(idclinic);
  const offices = await fetchOffices(idclinic);
  const types = await fetchTypes(idclinic);
  const users = await fetchUsers(idclinic);

  return (
    <div className="w-full">
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-[2rem] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-3 shadow-[0_25px_80px_rgba(59,130,246,0.08)] md:p-5">
              {/* Mobile View */}
              <div className="md:hidden">
                {services?.map((service) => {
                  const user = users.find((u) => u.id === service.iduser);
                  const client = clients.find((c) => c.id === service.idclient);
                  const office = offices.find((o) => o.id === service.idoffice);
                  const type = types.find((t) => t.id === service.idtype);

                  return (
                    <div
                      key={service.id}
                      className="mb-4 w-full rounded-[1.5rem] border border-blue-100 bg-white p-4 shadow-sm shadow-blue-100"
                    >
                      <div className="border-b border-slate-100 pb-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="text-lg font-bold text-slate-800">
                            {formatDateToLocal(service.date)}
                          </h3>
                          <StatusBadge status={service.status} />
                        </div>
                        <p className="mt-2 text-sm text-slate-600">
                          {client?.pronoun} {client?.name}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {formatTime(service.starttime)} – {formatTime(service.endtime)} ·{' '}
                          {type?.title}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">Consultório: {office?.title}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          Profissional: {user?.pronoun} {user?.name}
                        </p>
                      </div>
                      <div className="flex justify-end gap-2 pt-4">
                        <UpdateService id={service.id} />
                        <DeleteService id={service.id} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop View */}
              <table className="hidden min-w-full text-center text-slate-800 md:table">
                <thead className="bg-gradient-to-r from-blue-700 to-indigo-700 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                  <tr>
                    <th className="px-2 py-3">Ações</th>
                    <th className="px-2 py-3">Data</th>
                    <th className="px-2 py-3">Situação</th>
                    <th className="px-2 py-3">Início</th>
                    <th className="px-2 py-3">Fim</th>
                    <th className="px-2 py-3">Paciente</th>
                    <th className="px-2 py-3">Consultório</th>
                    <th className="px-2 py-3">Atendimento</th>
                    <th className="px-2 py-3">Profissional</th>
                    <th className="px-2 py-3">Excluir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {services.map((service) => {
                    const user = users.find((u) => u.id === service.iduser);
                    const client = clients.find((c) => c.id === service.idclient);
                    const office = offices.find((o) => o.id === service.idoffice);
                    const type = types.find((t) => t.id === service.idtype);

                    return (
                      <tr key={service.id} className="bg-white/80 transition hover:bg-blue-50/80">
                        <td className="px-2 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <UpdateService id={service.id} />
                          </div>
                        </td>
                        <td className="px-2 py-3 text-xs">{formatDateToLocal(service.date)}</td>
                        <td className="px-2 py-3">
                          <StatusBadge status={service.status} />
                        </td>
                        <td className="px-2 py-3 text-xs">{formatTime(service.starttime)}</td>
                        <td className="px-2 py-3 text-xs">{formatTime(service.endtime)}</td>
                        <td className="px-2 py-3 text-xs font-semibold">
                          {client?.pronoun} {client?.name}
                        </td>
                        <td className="px-2 py-3 text-xs">{office?.title}</td>
                        <td className="px-2 py-3 text-xs">{type?.title}</td>
                        <td className="px-2 py-3 text-xs">
                          {user?.pronoun} {user?.name}
                        </td>
                        <td className="px-2 py-3">
                          <div className="flex items-center justify-center">
                            <DeleteService id={service.id} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
