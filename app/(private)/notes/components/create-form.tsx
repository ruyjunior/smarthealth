'use client';
import React, { useState, useActionState } from 'react';
import Link from 'next/link';
import { UserGroupIcon, CalendarDateRangeIcon, 
  FireIcon, ClipboardIcon, ScaleIcon, EllipsisVerticalIcon 
} from '@heroicons/react/24/outline';
import { Button } from '@/app/components/ui/button';
import { createNote, State } from '@/app/query/notes/actions';
import { Client } from '@/app/query/clients/definitions';
import { formatDateBr } from '@/app/lib/utils';
import { User } from '@/app/query/users/definitions';


export default function Form({ client, users }: { client: Client; users: User[] }) {
  const initialState: State = { message: '', errors: {} };
  const [state, formAction] = useActionState(createNote, initialState);

  const today = new Date();
  const [date, setDate] = useState(today.toISOString().split('T')[0]);

  const handleChangeDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formattedDate = formatDateBr(event.target.value);
    setDate(formattedDate);
  };


  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">

        <input type="hidden" name="idclient" value={client.id} />

        {/* User */}
        <div className="mb-4">
          <label htmlFor="iduser" className="mb-2 block text-sm font-medium">
            Profissional
          </label>
          <div className="relative">
            <select
              id="iduser"
              name="iduser"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              aria-describedby="iduser-error"
            >
              <option value="" disabled>
                Selecione um Profissional
              </option>
              {users?.map((user: User) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
            <UserGroupIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="iduser-error" aria-live="polite" aria-atomic="true">
            {state.errors?.iduser &&
              state.errors.iduser.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
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
                onChange={handleChangeDate}
                placeholder="Enter a birth"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="birth-error"
              />
              <CalendarDateRangeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Peso */}
        <div className="mb-4">
          <label htmlFor="weight" className="mb-2 block text-sm font-medium">
            Peso
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="weight"
                name="weight"
                type="number"
                defaultValue="60"
                placeholder="Insira peso"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="enddate-error"
              />
              <ScaleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Altura */}
        <div className="mb-4">
          <label htmlFor="height" className="mb-2 block text-sm font-medium">
            Altura
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="height"
                name="height"
                type="number"
                defaultValue="170"
                placeholder="Insira altura"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="enddate-error"
              />
              <EllipsisVerticalIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Gordura */}
        <div className="mb-4">
          <label htmlFor="fat" className="mb-2 block text-sm font-medium">
            Gordura
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="fat"
                name="fat"
                type="number"
                defaultValue="20"
                placeholder="Insira gordura"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="enddate-error"
              />
              <FireIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Observação */}
        <div className="mb-4">
          <label htmlFor="note" className="mb-2 block text-sm font-medium">
            Observações
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <textarea
                id="note"
                name="note"
                rows={4}
                defaultValue="Notas sobre o atendimento"
                placeholder="Insira uma observação"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="note-error"
              />
              <ClipboardIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div id="note-error" aria-live="polite" aria-atomic="true">
            {state.errors?.note &&
              state.errors.note.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/notes"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancelar
        </Link>
        <Button type="submit">Criar</Button>
      </div>
    </form>
  );
}
