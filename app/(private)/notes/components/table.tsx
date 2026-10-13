import { UpdateNote, DeleteNote, PdfNotes } from './buttons';
import { getCurrentClinicId } from '@/app/lib/session';
import { fetchFilteredNotes } from '@/app/domains/notes/queries';
import { formatDateToLocal } from '@/app/lib/utils';
import { fetchUsers } from '@/app/domains/users/queries';
import { fetchNoteTypes } from '@/app/domains/notetypes/queries';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

export default async function NotesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number | undefined | null;
}) {
  const idclinic = await getCurrentClinicId();
  const notes = await fetchFilteredNotes(idclinic, query, currentPage);
  const users = await fetchUsers(idclinic);
  const types = await fetchNoteTypes(idclinic);

  return (
    <div className="w-full">
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-[2rem] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-3 shadow-[0_25px_80px_rgba(59,130,246,0.08)] md:p-5">
              {/* Mobile View */}
              <div className="md:hidden">
                {notes?.map((note) => {
                  const user = users.find((u) => u.id === note.iduser);
                  const type = types.find((t) => t.id === note.idnotetype);

                  return (
                    <div
                      key={note.id}
                      className="mb-4 w-full rounded-[1.5rem] border border-blue-100 bg-white p-4 shadow-sm shadow-blue-100"
                    >
                      <div className="border-b border-slate-100 pb-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="text-lg font-bold text-slate-800">
                            {type?.title ?? 'Ficha clínica'}
                          </h3>
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                            {formatDateToLocal(note.date)}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-slate-500">
                          Profissional: {user?.name ?? 'Não informado'}
                        </p>

                        {note.fields.map((field, index) => {
                          const fieldlabel = type?.fieldslabels[index];
                          return (
                            <p key={index} className="mt-3 text-sm leading-relaxed text-slate-600">
                              <span className="font-semibold text-slate-700">{fieldlabel}: </span>
                              {field || '—'}
                            </p>
                          );
                        })}
                        {note.checks.map((check, index) => {
                          const checklabel = type?.checkslabels[index];
                          return (
                            <div key={index} className="mt-2 flex items-center gap-2">
                              <span className="text-sm text-slate-600">{checklabel}</span>
                              {check && <CheckCircleIcon className="h-5 w-5 text-emerald-600" />}
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex justify-end gap-2 pt-4">
                        <PdfNotes id={note.id} />
                        <UpdateNote id={note.id} />
                        <DeleteNote id={note.id} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop View */}
              {/*Tabela principal*/}
              <table className="hidden min-w-full text-center text-slate-800 md:table">
                <thead className="bg-gradient-to-r from-blue-700 to-indigo-700 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                  <tr>
                    <th className="px-2 py-3">Ações</th>
                    <th className="px-2 py-3">Data</th>
                    <th className="px-2 py-3">Ficha</th>
                    <th className="px-2 py-3">Profissional</th>
                    <th className="px-2 py-3">Campos</th>
                    <th className="px-2 py-3">Caixas</th>
                    <th className="px-2 py-3">Excluir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {notes.map((note) => {
                    const user = users.find((u) => u.id === note.iduser);
                    const type = types.find((t) => t.id === note.idnotetype);

                    return (
                      <tr key={note.id} className="bg-white/80 transition hover:bg-blue-50/80">
                        <td className="px-2 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <UpdateNote id={note.id} />
                            <PdfNotes id={note.id} />
                          </div>
                        </td>
                        <td className="px-2 py-3 text-xs">{formatDateToLocal(note.date)}</td>
                        <td className="px-2 py-3 text-xs font-semibold">{type?.title}</td>
                        <td className="px-2 py-3 text-xs">{user?.name}</td>
                        <td className="px-2 py-3 text-xs">
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
                        <td className="px-2 py-3 text-xs">
                          <div className="flex flex-col gap-1">
                            {note.checks.map((check, index) => {
                              const checklabel = type?.checkslabels[index];
                              return (
                                <div key={index} className="flex flex-row gap-1 items-center">
                                  <span className="font-semibold">{checklabel}</span>
                                  <span>{check ? <CheckCircleIcon className="w-5" /> : ''}</span>
                                </div>
                              );
                            })}
                          </div>
                        </td>
                        <td className="px-2 py-3">
                          <div className="flex items-center justify-center">
                            <DeleteNote id={note.id} />
                          </div>
                        </td>
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
