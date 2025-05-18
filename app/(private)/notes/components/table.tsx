import { UpdateNote, DeleteNote } from './buttons';
import { fetchFilteredNotes } from '@/app/query/notes/data';
import { formatDateToLocal, formatTime } from '@/app/lib/utils';
import { fetchClients } from '@/app/query/clients/data';
import { fetchUsers } from '@/app/query/users/data';

export default async function NotesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number | undefined | null;
}) {

  const notes = await fetchFilteredNotes(query, currentPage);
  const clients = await fetchClients();
  const users = await fetchUsers();

  return (
    <div className="w-full">
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-lg bg-gray-50 shadow-md p-4 md:pt-0">

              {/* Mobile View */}
              <div className="md:hidden">
                {notes?.map((note) => {

                  const client = clients.find((c) => c.id === note.idclient);
                  const user = users.find((u) => u.id === note.iduser);

                  return (
                    <div key={note.id} className="mb-6 w-full rounded-lg bg-blue-300 p-4 shadow-sm">
                      <div className="border-b pb-4">
                        <h3 className="text-xl font-semibold text-gray-900">{formatDateToLocal(note.date)}</h3>
                        <p className="text-sm text-gray-600"> Profissional: {user?.name}</p>
                        <p className="text-sm text-gray-600"> Altura(cm): {note?.height}</p>
                        <p className="text-sm text-gray-600"> Peso(kg): {note?.weight}</p>
                        <p className="text-sm text-gray-600"> % de Gordura: {note?.fat}</p>
                        <p className="text-sm text-gray-600"> Nota: {note?.note}</p>
                      </div>
                      <div className="flex justify-end gap-3 pt-3">
                        <UpdateNote id={note.id} />
                        <DeleteNote id={note.id} />
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Desktop View */}
              <table className="hidden min-w-full text-gray-900 md:table">
                <thead className="bg-green-100 text-left text-xs font-medium">
                  <tr>
                    <th className="px-2 py-2">Editar</th>
                    <th className="px-2 py-2">Data</th>
                    <th className="px-2 py-2">Profissional</th>
                    <th className="px-2 py-2">Altura(cm)</th>
                    <th className="px-2 py-2">Peso(kg)</th>
                    <th className="px-2 py-2">% Gordura</th>
                    <th className="px-2 py-2">Nota</th>
                    <th className="px-2 py-2">Deletar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {notes.map((note) => {

                    const client = clients.find((c) => c.id === note.idclient);
                    const user = users.find((u) => u.id === note.iduser);

                    return (
                      <tr key={note.id} className="hover:bg-gray-300">
                        <td className="py-2 px-2 flex gap-2">
                          <UpdateNote id={note.id} />
                        </td>
                        <td className="px-2 py-2 text-xs">{formatDateToLocal(note.date)}</td>
                        <td className="px-2 py-2 text-xs">{user?.name}</td>
                        <td className="px-2 py-2 text-xs">{note.height}</td>
                        <td className="px-2 py-2 text-xs">{note.weight}</td>
                        <td className="px-2 py-2 text-xs">{note.fat}</td>
                        <td className="px-2 py-2 text-xs">{note.note}</td>
                        <td className="py-2 px-2 flex justify-end">
                          <DeleteNote id={note.id} />
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
