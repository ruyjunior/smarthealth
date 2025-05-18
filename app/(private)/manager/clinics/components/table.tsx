import { fetchClientById } from '@/app/query/clients/data';
import { Updateclinic, Deleteclinic } from './buttons';
import { fetchFilteredClinics } from '@/app/query/clinics/data';
import { fetchUsers } from '@/app/query/users/data';

export default async function clinicsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const clinics = await fetchFilteredClinics(query, currentPage);
  const users = await fetchUsers();

  return (
    <div className="w-full">
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-lg bg-gray-50 shadow-md p-4 md:pt-0">
              {/* Mobile View */}
              <div className="md:hidden">
                {clinics?.map((clinic) => {

                  const manager = users.find((u) => u.id === clinic.idmanager) || { name: 'Gerente Desconhecido' };

                  return (
                    <div key={clinic.id} className="mb-6 w-full rounded-lg bg-blue-300 p-4 shadow-sm">
                      <div className="border-b pb-4">
                        <h3 className="text-xl font-semibold text-gray-900">{clinic.title}</h3>
                        <p className="text-sm text-gray-600">Gerente: {manager.name}</p>
                      </div>
                      <div className="flex justify-end gap-3 pt-3">
                        <Updateclinic id={clinic.id} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop View */}
              <table className="hidden min-w-full text-gray-900 md:table">
                <thead className="bg-green-100 text-left text-xs font-medium">
                  <tr>
                    <th className="px-2 py-2">Editar</th>
                    <th className="px-2 py-2">Título</th>
                    <th className="px-2 py-2">Gerente</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {clinics.map((clinic) => {
                    const manager = users.find((u) => u.id === clinic.idmanager) || { name: 'Gerente Desconhecido' };
                    return (
                      <tr key={clinic.id} className="hover:bg-gray-300">
                        <td className="py-2 px-2 flex gap-2">
                          <Updateclinic id={clinic.id} />
                        </td>
                        <td className="px-2 py-2 text-xs">{clinic.title}</td>
                        <td className="px-2 py-2 text-xs">{manager.name}</td>
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
