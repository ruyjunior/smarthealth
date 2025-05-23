import { UpdateNoteType, DeleteNoteType } from './buttons';
import { fetchFilteredNoteTypes } from '@/app/query/notetypes/data';
import { formatCurrency } from '@/app/lib/utils';

export default async function NoteTypesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const types = await fetchFilteredNoteTypes(query, currentPage);
  return (
    <div className="w-full">
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-lg bg-blue-200 shadow-md p-4 md:pt-0">
              {/* Mobile View */}
              <div className="md:hidden">
                {types?.map((notetype) => (
                  <div key={notetype.id} className="mb-6 w-full rounded-lg bg-blue-300 p-4 shadow-sm">
                    <div className="border-b pb-4">
                      <h3 className="text-xl font-semibold text-gray-900">{notetype.title}</h3>
                      <p className="text-sm text-gray-600">Etiquetas dos Campos: {notetype.fieldslabels.join(', ')}</p>
                      <p className="text-sm text-gray-600">Etiquetas das Caixas: {notetype.checkslabels.join(', ')}</p>
                    </div>
                    <div className="flex justify-end gap-3 pt-3">
                      <UpdateNoteType id={notetype.id} />
                      <DeleteNoteType id={notetype.id} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View */}
              <table className="hidden min-w-full text-gray-900 text-center text-gray-900 md:table">
                <thead className="bg-blue-300 text-xs font-medium">
                  <tr>
                    <th className="px-2 py-2">Editar</th>
                    <th className="px-2 py-2">Título</th>  
                    <th className="px-2 py-2">Etiqueta dos Campos</th>
                    <th className="px-2 py-2">Etiqueta dos Checks</th>
                    <th className="px-2 py-2">Deletar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {types.map((notetype) => (
                    <tr key={notetype.id} className="hover:bg-blue-300">
                      <td className="py-2 px-2 flex gap-2 itens-center justify-center">
                        <UpdateNoteType id={notetype.id} />
                      </td>
                      <td className="px-2 py-2 text-xs">{notetype.title}</td>
                      <td className="px-2 py-2 text-xs">{notetype.fieldslabels.join(', ')}</td>
                      <td className="px-2 py-2 text-xs">{notetype.checkslabels.join(', ')}</td>
                      <td className="py-2 px-2 flex justify-center">
                        <DeleteNoteType id={notetype.id} />
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
