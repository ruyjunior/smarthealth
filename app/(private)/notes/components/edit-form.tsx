'use client';
import { useActionState, useState, useTransition } from 'react';
import { Note } from '@/app/domains/notes/types';
import { CalendarDateRangeIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { updateNote, State } from '@/app/domains/notes/actions';
import { User } from '@/app/domains/users/types';
import { Client } from '@/app/domains/clients/types';
import { formatDateDb } from '@/app/lib/utils';
import { NoteType } from '@/app/domains/notetypes/types';
import Loading from '@/app/components/ui/loading';

export default function EditNoteForm({
  note,
  client,
  user,
  types,
}: {
  note: Note;
  client: Client;
  user: User;
  types: NoteType[];
}) {
  const initialState: State = { message: '', errors: {} };
  const updateNoteWithId = updateNote.bind(null, note.id);
  const [, formAction] = useActionState(updateNoteWithId, initialState);
  const [type] = useState<NoteType | null>(types.find((t) => t.id === note.idnotetype) ?? null);
  const [isPending, startTransition] = useTransition();

  const date = formatDateDb(note.date);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    startTransition(() => {
      formAction(new FormData(e.currentTarget));
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-5xl rounded-[2rem] border border-blue-100 bg-white p-4 shadow-[0_25px_80px_rgba(37,99,235,0.1)] sm:p-6 md:p-8"
    >
      {/* Mensagem Carregando */}
      {isPending ? (
        <Loading />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Campos ocultos */}
          <input type="hidden" name="idclient" value={client.id} />
          <input type="hidden" name="iduser" value={user.id} />
          <input type="hidden" name="idnotetype" value={note.idnotetype} />

          {/*Tipo de Ficha */}
          <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 md:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
              Ficha clínica
            </p>
            <p className="mt-1 text-lg font-bold text-blue-900">{type?.title}</p>
          </div>

          {/* Data */}
          <div>
            <label htmlFor="date" className="mb-2 block text-sm font-semibold text-slate-700">
              Data
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="date"
                  name="date"
                  type="date"
                  defaultValue={date}
                  maxLength={10}
                  //nChange={handleChangeDate}
                  placeholder="Insira o nascimento"
                  className="peer block min-h-12 w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                  aria-describedby="birth-error"
                />
                <CalendarDateRangeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>

          {/* Campos dinâmicos */}
          {(type || note) && (
            <>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 md:col-span-2">
                {type?.fieldslabels?.length ? (
                  <p className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-blue-800">
                    Campos
                  </p>
                ) : null}
                {type?.fieldslabels.map((label, idx) => (
                  <div key={idx} className="relative mt-4">
                    <p className="mb-2 text-sm font-semibold text-slate-700">{label}</p>
                    <textarea
                      name="fields[]"
                      placeholder={label}
                      defaultValue={note.fields?.[idx] ?? ''}
                      rows={3}
                      className="peer block w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                    />
                    <QuestionMarkCircleIcon className="pointer-events-none absolute left-3 top-[2.65rem] h-[18px] w-[18px] text-slate-400 peer-focus:text-blue-600" />
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5 md:col-span-2">
                {type?.checkslabels?.length ? (
                  <p className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-blue-800">
                    Caixas de seleção
                  </p>
                ) : null}
                {type?.checkslabels.map((label, idx) => (
                  <label
                    key={idx}
                    className="mt-3 flex cursor-pointer items-center gap-3 rounded-xl border border-blue-100 bg-white p-3 text-sm font-medium text-slate-700 transition hover:border-blue-300"
                  >
                    <input
                      name="checks[]"
                      type="checkbox"
                      value="true"
                      defaultChecked={!!note.checks?.[idx]}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Botões de ação */}
      <div className="mt-8 flex flex-col-reverse justify-end gap-3 border-t border-slate-100 pt-6 sm:flex-row">
        <Link
          href={`/clients/${client.id}/view`}
          className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          Cancelar
        </Link>
        <Button type="submit" disabled={isPending} aria-disabled={isPending}>
          {isPending ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Salvando...
            </span>
          ) : (
            'Salvar'
          )}
        </Button>
      </div>
    </form>
  );
}
