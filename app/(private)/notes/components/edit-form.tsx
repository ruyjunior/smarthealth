'use client';
import { useActionState, useState } from 'react';
import { Note } from '@/app/query/notes/definitions';
import {
  UserGroupIcon, CalendarDateRangeIcon, QuestionMarkCircleIcon, ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { updateNote, State } from '@/app/query/notes/actions';
import { User } from '@/app/query/users/definitions';
import { Client } from '@/app/query/clients/definitions';
import { formatDateDb } from '@/app/lib/utils';
import { NoteType } from '@/app/query/notetypes/definitions';


export default function EditNoteForm({
  note, client, user, types
}: {
  note: Note, client: Client, user: User, types: NoteType[]
}
) {

  const initialState: State = { message: '', errors: {} };
  const updateNoteWithId = updateNote.bind(null, note.id);
  const [state, formAction] = useActionState(updateNoteWithId, initialState);
  const [type, setType] = useState<NoteType | null>(
    types.find(t => t.id === note.idnotetype) ?? null
  );

  const date = formatDateDb(note.date);

  const handleChangeType = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = types.find(t => t.id === event.target.value);
    setType(selected || null);
  };

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">

        <input type="hidden" name="idclient" value={client.id} />
        <input type="hidden" name="iduser" value={user.id} />
        <input type="hidden" name="idnotetype" value={note.idnotetype} />

        {/*Tipo de Ficha */}
        <div className="mb-4">
          <label htmlFor="idnotetype" className="mb-2 block text-sm font-medium">
            Ficha: {type?.title}
          </label>
        </div>

        {/* Data */}
        <div className="mb-4">
          <label htmlFor="date" className="mb-2 block text-sm font-medium">
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
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="birth-error"
              />
              <CalendarDateRangeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Campos dinâmicos */}
        {(type || note) && (
          <>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium">
                {note.fields[0] ? 'Campos' : ''}
              </label>
              {type?.fieldslabels.map((label, idx) => (
                <div key={idx} className="relative mt-2 rounded-md">
                  <p className='text-xs'>{label}</p>
                  <textarea
                    name="fields[]"
                    //type="text"
                    placeholder={label}
                    defaultValue={note.fields?.[idx] ?? ''}
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  />
                  <QuestionMarkCircleIcon className="pointer-events-none absolute left-3 top-2/3 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                </div>
              ))}
            </div>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium">
                {note.checks[0] ? 'Caixas de seleção' : ''}
              </label>
              {type?.checkslabels.map((label, idx) => (
                <div key={idx} className="relative mt-2 rounded-md flex items-center gap-2">
                  <input
                    name="checks[]"
                    type="checkbox"
                    value="true"
                    defaultChecked={!!note.checks?.[idx]}
                    className="h-4 w-4"
                  />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </>
        )}

      </div>

      {/* Botões de ação */}
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href={`/clients/${client.id}/view`}
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancelar
        </Link>
        <Button type="submit">Editar</Button>
      </div>
    </form>
  );
}
