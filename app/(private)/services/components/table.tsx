import { UpdateService, DeleteService } from './buttons';
import { fetchFilteredServices } from '@/app/query/services/data';
import { formatDateToLocal, formatTime } from '@/app/lib/utils';
import { fetchClients } from '@/app/query/clients/data';
import { fetchOffices } from '@/app/query/offices/data';
import { fetchTypes } from '@/app/query/types/data';
import { fetchUsers } from '@/app/query/users/data';
import CalendarView from './calendarView';
import { ServiceWithDetails } from '@/app/query/services/definitions';


export default async function ServicesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {

  const services = await fetchFilteredServices(query, currentPage);
  const clients = await fetchClients();
  const offices = await fetchOffices();
  const types = await fetchTypes();
  const users = await fetchUsers();

  const ServicesData: ServiceWithDetails[] = services.map((service) => {
    const user = users.find((u) => u.id === service.iduser) || { name: 'Unknown User' };
    const client = clients.find((c) => c.id === service.idclient) || { name: 'Unknown Client', pronoun: 'Unknown Pronoun' };
    const office = offices.find((o) => o.id === service.idoffice) || { title: 'Unknown Office' };
    const type = types.find((t) => t.id === service.idtype) || { title: 'Unknown Type' };
  
    return {
      ...service,
      user,
      client,
      office,
      type,
    };
  });
  

  return (
    <div className="w-full">
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-lg bg-blue-200 shadow-md p-4 md:pt-0">
              {/* Mobile View */}
              <div className="md:hidden">
                {services?.map((service) => {

                  const user = users.find((u) => u.id === service.iduser);
                  const client = clients.find((c) => c.id === service.idclient);
                  const office = offices.find((o) => o.id === service.idoffice);
                  const type = types.find((t) => t.id === service.idtype);

                  return (
                    <div key={service.id} className="mb-6 w-full rounded-lg bg-blue-300 p-4 shadow-sm">
                      <div className="border-b pb-4">
                        <h3 className="text-xl font-semibold text-gray-900">{formatDateToLocal(service.date)}</h3>
                        <p className="text-sm text-gray-600">Situação: {service.status}</p>
                        <p className="text-sm text-gray-600">Início: {formatTime(service.starttime)}</p>
                        <p className="text-sm text-gray-600">Fim: {formatTime(service.endtime)}</p>
                        <p className="text-sm text-gray-600">Paciente: {client?.pronoun} {client?.name}</p>
                        <p className="text-sm text-gray-600">Consultório: {office?.title}</p>
                        <p className="text-sm text-gray-600">Atendimento: {type?.title}</p>
                        <p className="text-sm text-gray-600"> Profissional: {user?.name}</p>
                      </div>
                      <div className="flex justify-end gap-3 pt-3">
                        <UpdateService id={service.id} />
                        <DeleteService id={service.id} />
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Desktop View */}
              <table className="hidden min-w-full text-center text-gray-900 md:table">
                <thead className="bg-blue-300 text-xs font-medium">
                  <tr>
                    <th className="px-2 py-2">Editar</th>
                    <th className="px-2 py-2">Data</th>
                    <th className="px-2 py-2">Situação</th>
                    <th className="px-2 py-2">Início</th>
                    <th className="px-2 py-2">Fim</th>
                    <th className="px-2 py-2">Paciente</th>
                    <th className="px-2 py-2">Consultório</th>
                    <th className="px-2 py-2">Atendimento</th>
                    <th className="px-2 py-2">Profissional</th>
                    <th className="px-2 py-2">Deletar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {services.map((service) => {

                    const user = users.find((u) => u.id === service.iduser);
                    const client = clients.find((c) => c.id === service.idclient);
                    const office = offices.find((o) => o.id === service.idoffice);
                    const type = types.find((t) => t.id === service.idtype);

                    return (
                      <tr key={service.id} className="hover:bg-blue-300">
                        <td className="py-2 px-2 flex gap-2 items-center justify-center">
                          <UpdateService id={service.id} />
                        </td>
                        <td className="px-2 py-2 text-xs">{formatDateToLocal(service.date)}</td>
                        <td className="px-2 py-2 text-xs">{service.status}</td>
                        <td className="px-2 py-2 text-xs">{formatTime(service.starttime)}</td>
                        <td className="px-2 py-2 text-xs">{formatTime(service.endtime)}</td>
                        <td className="px-2 py-2 text-xs">{}{client?.pronoun} {client?.name}</td>
                        <td className="px-2 py-2 text-xs">{office?.title}</td>
                        <td className="px-2 py-2 text-xs">{type?.title}</td>
                        <td className="px-2 py-2 text-xs">{user?.pronoun} {user?.name}</td>
                        <td className="py-2 px-2 flex justify-center items-center">
                          <DeleteService id={service.id} />
                        </td>
                      </tr>
                    )
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
