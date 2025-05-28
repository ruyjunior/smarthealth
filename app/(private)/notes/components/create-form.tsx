'use client';
import React, { useState, useActionState, useTransition } from 'react';
import Link from 'next/link';
import { CalendarDateRangeIcon, ClipboardDocumentListIcon, QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/app/components/ui/button';
import { createNote, State } from '@/app/query/notes/actions';
import { Client } from '@/app/query/clients/definitions';
import { formatDateBr } from '@/app/lib/utils';
import { User } from '@/app/query/users/definitions';
import { NoteType } from '@/app/query/notetypes/definitions';
import Image from 'next/image';


export default function Form({ client, user, types }: { client: Client; user: User, types: NoteType[] }) {
  const initialState: State = { message: '', errors: {} };
  const [state, formAction] = useActionState(createNote, initialState);
  const [isPending, startTransition] = useTransition();

  const today = new Date();
  const [date, setDate] = useState(today.toISOString().split('T')[0]);
  // Inicializa com null ou com o primeiro tipo, se quiser
  const [type, setType] = useState<NoteType | null>(null);

  const handleChangeDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formattedDate = formatDateBr(event.target.value);
    setDate(formattedDate);
  };
  const handleChangeType = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = types.find(t => t.id === event.target.value);
    setType(selected || null);
  };

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    startTransition(() => {
      formAction(new FormData(e.currentTarget));
    });
  }


  return (
    <form onSubmit={handleSubmit}>

      {/* Mensagem Carregando */}
      {isPending ? (
        <div className="flex flex-col items-center justify-center min-h-[200px] gap-2 text-blue-700">
          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          Processando...
          <Image src='/ecg.gif' alt="logo App" width={200} height={200} />
        </div>
      ) : (

        <div className="rounded-md bg-gray-50 p-4 md:p-6">

          <input type="hidden" name="idclient" value={client.id} />
          <input type="hidden" name="iduser" value={user.id} />

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
                  onChange={handleChangeDate}
                  placeholder="Enter a birth"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="birth-error"
                />
                <CalendarDateRangeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>

          {/*Tipo de Ficha */}
          <div className="mb-4">
            <label htmlFor="idnotetype" className="mb-2 block text-sm font-medium">
              Ficha
            </label>
            <div className="relative">
              <select
                id="idnotetype"
                name="idnotetype"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                defaultValue=""
                onChange={handleChangeType}
                aria-describedby="idnotetype-error"
              >
                <option value="" disabled>
                  Selecione um tipo de Ficha
                </option>
                {types.map((type: NoteType) => (
                  <option key={type.id} value={type.id}>
                    {type.title}
                  </option>
                ))}
              </select>
              <ClipboardDocumentListIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
            <div id="idnotetype-error" aria-live="polite" aria-atomic="true">
              {state.errors?.idnotetype &&
                state.errors.idnotetype.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>

          {/* Campos dinâmicos */}
          {type && (
            <>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium">
                  Campos
                </label>
                {type.fieldslabels.map((label, idx) => (
                  <div key={idx} className="relative mt-2 rounded-md">
                    <p className='text-xs'>{label}</p>
                    <textarea
                      name="fields[]"
                      //type="text"
                      placeholder={label}
                      className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    />
                    <QuestionMarkCircleIcon className="pointer-events-none absolute left-3 top-2/3 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                  </div>
                ))}
              </div>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium">
                  Caixas de seleção
                </label>
                {type.checkslabels.map((label, idx) => (
                  <div key={idx} className="relative mt-2 rounded-md flex items-center gap-2">
                    <input
                      name="checks[]"
                      type="checkbox"
                      value="true"
                      className="h-4 w-4"
                    />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </>
          )}

        </div>
      )}

      {/* Botões de ação */}
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href={`/clients/${client.id}/view`}
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancelar
        </Link>
        <Button type="submit" disabled={isPending} aria-disabled={isPending}>
          {isPending ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Salvando...
            </span>
          ) : (
            "Salvar"
          )}
        </Button>
      </div>
    </form>
  );
}
