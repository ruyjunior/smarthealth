import { UpdateOffice, DeleteOffice } from './buttons';
import { fetchFilteredOffices } from '@/app/query/offices/data';

export default async function OfficesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const offices = await fetchFilteredOffices(query, currentPage);
  return (
    <div className="w-full">
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-lg bg-blue-200 shadow-md p-4 md:pt-0">
              {/* Mobile View */}
              <div className="md:hidden">
                {offices?.map((office) => (
                  <div key={office.id} className="mb-6 w-full rounded-lg bg-blue-300 p-4 shadow-sm">
                    <div className="border-b pb-4">
                      <h3 className="text-xl font-semibold text-gray-900">{office.title}</h3>
                      <p className="text-sm text-gray-600">Desc.: {office.description}</p>
                    </div>
                    <div className="flex justify-end gap-3 pt-3">
                      <UpdateOffice id={office.id} />
                      <DeleteOffice id={office.id} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View */}
              <table className="hidden min-w-full text-gray-900 text-center md:table">
                <thead className="bg-blue-300 text-xs font-medium">
                  <tr>
                    <th className="px-2 py-2">Editar</th>
                    <th className="px-2 py-2">Título</th>
                    <th className="px-2 py-2">Descrição</th>
                    <th className="px-2 py-2">Deletar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {offices.map((office) => (
                    <tr key={office.id} className="hover:bg-blue-300">
                      <td className="py-2 px-2 flex gap-2 itens-center justify-center">
                        <UpdateOffice id={office.id} />
                      </td>
                      <td className="px-2 py-2 text-xs">{office.title}</td>
                      <td className="px-2 py-2 text-xs">{office.description}</td>
                      <td className="py-2 px-2 flex items-center justify-center">
                        <DeleteOffice id={office.id} />
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
