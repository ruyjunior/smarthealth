import { UpdateService, DeleteService } from './buttons';
import { fetchFilteredServices } from '@/app/query/services/data';
import { formatDateToLocal, formatTime } from '@/app/lib/utils';


export default async function ServicesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const services = await fetchFilteredServices(query, currentPage);

  return (
    <div className="w-full">
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-lg bg-gray-50 shadow-md p-4 md:pt-0">
              {/* Mobile View */}
              <div className="md:hidden">
                {services?.map((service) => (
                  <div key={service.id} className="mb-6 w-full rounded-lg bg-blue-300 p-4 shadow-sm">
                    <div className="border-b pb-4">
                      <h3 className="text-xl font-semibold text-gray-900">{formatDateToLocal(service.date)}</h3>
                      <p className="text-sm text-gray-600">Desc.: {service.status}</p>
                    </div>
                    <div className="flex justify-end gap-3 pt-3">
                      <UpdateService id={service.id} />
                      <DeleteService id={service.id} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View */}
              <table className="hidden min-w-full text-gray-900 md:table">
                <thead className="bg-green-100 text-left text-xs font-medium">
                  <tr>
                    <th className="px-2 py-2">Editar</th>
                    <th className="px-2 py-2">Data</th>
                    <th className="px-2 py-2">Estado</th>
                    <th className="px-2 py-2">Deletar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {services.map((service) => (
                    <tr key={service.id} className="hover:bg-gray-300">
                      <td className="py-2 px-2 flex gap-2">
                        <UpdateService id={service.id} />
                      </td>
                      <td className="px-2 py-2 text-xs">{formatDateToLocal(service.date)}</td>
                      <td className="px-2 py-2 text-xs">{service.status}</td>
                      <td className="py-2 px-2 flex justify-end">
                        <DeleteService id={service.id} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
