import { UpdateType, DeleteType } from './buttons';
import { fetchFilteredTypes } from '@/app/query/types/data';
import { formatCurrency } from '@/app/lib/utils';

export default async function TypesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const types = await fetchFilteredTypes(query, currentPage);
  return (
    <div className="w-full">
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-lg bg-gray-50 shadow-md p-4 md:pt-0">
              {/* Mobile View */}
              <div className="md:hidden">
                {types?.map((type) => (
                  <div key={type.id} className="mb-6 w-full rounded-lg bg-blue-300 p-4 shadow-sm">
                    <div className="border-b pb-4">
                      <h3 className="text-xl font-semibold text-gray-900">{type.title}</h3>
                      <p className="text-sm text-gray-600">Desc.: {type.description}</p>
                      <p className="text-sm text-gray-600">Valor: {formatCurrency(Number(type.price))}</p>
                    </div>
                    <div className="flex justify-end gap-3 pt-3">
                      <UpdateType id={type.id} />
                      <DeleteType id={type.id} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View */}
              <table className="hidden min-w-full text-gray-900 md:table">
                <thead className="bg-green-100 text-left text-xs font-medium">
                  <tr>
                    <th className="px-2 py-2">Editar</th>
                    <th className="px-2 py-2">Título</th>
                    <th className="px-2 py-2">Descrição</th>
                    <th className="px-2 py-2">Preço</th>
                    <th className="px-2 py-2">Deletar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {types.map((type) => (
                    <tr key={type.id} className="hover:bg-gray-300">
                      <td className="py-2 px-2 flex gap-2">
                        <UpdateType id={type.id} />
                      </td>
                      <td className="px-2 py-2 text-xs">{type.title}</td>
                      <td className="px-2 py-2 text-xs">{type.description}</td>
                      <td className="px-2 py-2 text-xs">{formatCurrency(Number(type.price))}</td>
                      <td className="py-2 px-2 flex justify-end">
                        <DeleteType id={type.id} />
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
