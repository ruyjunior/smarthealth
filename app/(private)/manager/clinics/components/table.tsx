import { getCurrentClinicId } from '@/app/lib/session';
import { Updateclinic } from './buttons';
import { fetchFilteredClinics } from '@/app/domains/clinics/queries';
import { fetchUsers } from '@/app/domains/users/queries';

export default async function clinicsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const idclinic = await getCurrentClinicId();
  const clinics = await fetchFilteredClinics(idclinic, query, currentPage);
  const users = await fetchUsers(idclinic);

  return (
    <div className="w-full">
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-[2rem] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-3 shadow-[0_25px_80px_rgba(59,130,246,0.08)] md:p-5">
              {/* Mobile View */}
              <div className="md:hidden">
                {clinics?.map((clinic) => {
                  const manager = users.find((u) => u.id === clinic.idmanager) || {
                    name: 'Gerente Desconhecido',
                  };

                  return (
                    <div
                      key={clinic.id}
                      className="mb-4 w-full rounded-[1.5rem] border border-blue-100 bg-white p-4 shadow-sm shadow-blue-100"
                    >
                      <div className="border-b pb-4">
                        <h3 className="text-xl font-semibold text-gray-900">{clinic.title}</h3>
                        <p className="text-sm text-gray-600">Gerente: {manager.name}</p>
                        <p className="text-sm text-gray-600">Telefone: {clinic.phone}</p>
                        <p className="text-sm text-gray-600">CNPJ: {clinic.cnpj}</p>
                        <p className="text-sm text-gray-600">Endereço: {clinic.address}</p>
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
                    <th className="px-2 py-2">Telefone</th>
                    <th className="px-2 py-2">CNPJ</th>
                    <th className="px-2 py-2">Endereço</th>
                    <th className="px-2 py-2">Site</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {clinics.map((clinic) => {
                    const manager = users.find((u) => u.id === clinic.idmanager) || {
                      name: 'Gerente Desconhecido',
                    };
                    return (
                      <tr key={clinic.id} className="hover:bg-gray-300">
                        <td className="py-2 px-2 flex gap-2">
                          <Updateclinic id={clinic.id} />
                        </td>
                        <td className="px-2 py-2 text-xs">{clinic.title}</td>
                        <td className="px-2 py-2 text-xs">{manager.name}</td>
                        <td className="px-2 py-2 text-xs">{clinic.phone}</td>
                        <td className="px-2 py-2 text-xs">{clinic.cnpj}</td>
                        <td className="px-2 py-2 text-xs">{clinic.address}</td>
                        <td className="px-2 py-2 text-xs">{clinic.siteurl}</td>
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
