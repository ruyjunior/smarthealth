import { UpdateNoteType, DeleteNoteType } from './buttons';
import { getCurrentClinicId } from '@/app/lib/session';
import { fetchFilteredNoteTypes } from '@/app/domains/notetypes/queries';

export default async function NoteTypesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const idclinic = await getCurrentClinicId();
  const types = await fetchFilteredNoteTypes(idclinic, query, currentPage);
  return (
    <div className="w-full">
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-[2rem] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-3 shadow-[0_25px_80px_rgba(59,130,246,0.08)] md:p-5">
              {/* Mobile View */}
              <div className="md:hidden">
                {types?.map((notetype) => (
                  <div
                    key={notetype.id}
                    className="mb-4 w-full rounded-[1.5rem] border border-blue-100 bg-white p-4 shadow-sm shadow-blue-100"
                  >
                    <div className="border-b pb-4">
                      <h3 className="text-xl font-semibold text-gray-900">{notetype.title}</h3>
                      <p className="text-sm text-gray-600">
                        Etiquetas dos Campos: {notetype.fieldslabels.join(', ')}
                      </p>
                      <p className="text-sm text-gray-600">
                        Etiquetas das Caixas: {notetype.checkslabels.join(', ')}
                      </p>
                    </div>
                    <div className="flex justify-end gap-3 pt-3">
                      <UpdateNoteType id={notetype.id} />
                      <DeleteNoteType id={notetype.id} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View */}
              <table className="hidden min-w-full text-slate-800 text-center md:table">
                <thead className="bg-gradient-to-r from-blue-700 to-indigo-700 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                  <tr>
                    <th className="px-2 py-2">Editar</th>
                    <th className="px-2 py-2">Título</th>
                    <th className="px-2 py-2">Etiqueta dos Campos</th>
                    <th className="px-2 py-2">Etiqueta dos Checks</th>
                    <th className="px-2 py-2">Deletar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {types.map((notetype) => (
                    <tr key={notetype.id} className="bg-white/80 transition hover:bg-blue-50/80">
                      <td className="py-2 px-2 flex gap-2 items-center justify-center">
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
