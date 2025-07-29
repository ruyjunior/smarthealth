import { UpdateNote, DeleteNote, PdfNotes } from './buttons';
import { fetchFilteredNotes } from '@/app/query/notes/data';
import { formatDateToLocal, formatTime } from '@/app/lib/utils';
import { fetchClients } from '@/app/query/clients/data';
import { fetchUsers } from '@/app/query/users/data';
import { fetchNoteTypes } from '@/app/query/notetypes/data';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

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
  const types = await fetchNoteTypes();

  return (
    <div className="w-full">
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-lg bg-blue-200 shadow-md p-4 md:pt-0">

              {/* Mobile View */}
              <div className="md:hidden">
                {notes?.map((note) => {

                  const client = clients.find((c) => c.id === note.idclient);
                  const user = users.find((u) => u.id === note.iduser);
                  const type = types.find((t) => t.id === note.idnotetype);

                  return (
                    <div key={note.id} className="mb-6 w-full rounded-lg bg-blue-300 p-4 shadow-sm">
                      <div className="border-b pb-4">
                        <h3 className="text-xl font-semibold text-gray-900">{formatDateToLocal(note.date)}</h3>
                        <h3 className="text-xl font-semibold text-gray-900">{type?.title}</h3>
                        <p className="text-sm text-gray-600"> Profissional: {user?.name}</p>

                        {note.fields.map((field, index) => {
                          const fieldlabel = type?.fieldslabels[index];
                          return (
                            <p key={index} className="text-sm text-gray-600">
                              {fieldlabel} - {field}
                            </p>
                          )
                        })}
                        {note.checks.map((check, index) => {
                          const checklabel = type?.checkslabels[index];
                          return (
                            <div key={index} className="flex flex-row gap-1 items-center">
                              <span className="text-sm text-gray-600">{checklabel}</span>
                              <span>{check ?
                                <CheckCircleIcon className='w-5' /> : ''}</span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex justify-end gap-3 pt-3">
                        <PdfNotes id={note.id} />
                        <UpdateNote id={note.id} />
                        <DeleteNote id={note.id} />
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Desktop View */}
              {/*Tabela principal*/}
              <table className="hidden min-w-full text-gray-900 text-center md:table">
                <thead className="bg-blue-300 text-xs font-medium">
                  <tr>
                    <th className="px-2 py-2">Editar</th>
                    <th className="px-2 py-2">Data</th>
                    <th className="px-2 py-2">Ficha</th>
                    <th className="px-2 py-2">Profissional</th>
                    <th className="px-2 py-2">Campos</th>
                    <th className="px-2 py-2">Caixas</th>
                    <th className="px-2 py-2">Deletar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {notes.map((note) => {

                    const client = clients.find((c) => c.id === note.idclient);
                    const user = users.find((u) => u.id === note.iduser);
                    const type = types.find((t) => t.id === note.idnotetype);

                    return (
                      <tr key={note.id} className="hover:bg-blue-300">
                        <td className="py-2 px-2 flex gap-2 items-center justify-center">
                          <UpdateNote id={note.id} />
                          <PdfNotes id={note.id} />
                        </td>
                        <td className="px-2 py-2 text-xs">{formatDateToLocal(note.date)}</td>
                        <td className="px-2 py-2 text-xs">{type?.title}</td>
                        <td className="px-2 py-2 text-xs">{user?.name}</td>
                        <td className="px-2 py-2 text-xs">
                          <div className="flex flex-col gap-1">
                            {note.fields.map((field, index) => {
                              const fieldlabel = type?.fieldslabels[index];
                              return (
                                <div key={index} className="flex flex-row gap-1 items-center">
                                  <span className="font-semibold">{fieldlabel}</span>
                                  <span>{field}</span>
                                </div>
                              );
                            })}
                          </div>
                        </td>
                        <td className="px-2 py-2 text-xs">
                          <div className="flex flex-col gap-1">
                            {note.checks.map((check, index) => {
                              const checklabel = type?.checkslabels[index];
                              return (
                                <div key={index} className="flex flex-row gap-1 items-center">
                                  <span className="font-semibold">{checklabel}</span>
                                  <span>{check ?
                                    <CheckCircleIcon className='w-5' /> : ''}</span>
                                </div>
                              );
                            })}
                          </div>
                        </td>
                        <td className="py-2 px-2 flex justify-center items-center">
                          <DeleteNote id={note.id} />
                        </td>
                      </tr>)
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}
