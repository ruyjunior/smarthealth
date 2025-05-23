'use client';
import { useActionState } from 'react';
import { NoteType } from '@/app/query/notetypes/definitions';
import { TagIcon, CheckCircleIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { updateNoteType, State } from '@/app/query/notetypes/actions';

export default function EditNoteTypeForm({
  notetype,
}: {
  notetype: NoteType;
}) {

  const initialState: State = { message: null, errors: {} };
  const updateNoteTypeWithId = updateNoteType.bind(null, notetype.id);
  const [state, formAction] = useActionState(updateNoteTypeWithId, initialState);

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">

        {/* Title */}
        <div className="mb-4">
          <label htmlFor="title" className="mb-2 block text-sm font-medium">
            Título
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="title"
                name="title"
                type="text"
                placeholder="Insira um Título"
                defaultValue={notetype.title}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="title-error"
              />
              <TagIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="title-error" aria-live="polite" aria-atomic="true">
              {state.errors?.title &&
                state.errors.title.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>

        {/* Labels dos Campos */}
        <div className="mb-4">
          <label htmlFor="fieldslabels" className="mb-2 block text-sm font-medium">
            Rótulos dos campos de perguntas
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="fieldslabels"
                name="fieldslabels"
                type="text"
                placeholder="Insira os rótulos (separadas por vírgula)"
                defaultValue={notetype.fieldslabels.join(', ')}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="fieldslabels-error"
              />
              <QuestionMarkCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Labels dos Checks */}
        <div className="mb-4">
          <label htmlFor="checkslabels" className="mb-2 block text-sm font-medium">
            Rótulos das Caixas de seleção
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="checkslabels"
                name="checkslabels"
                type="text"
                placeholder="Insira os rótulos (separadas por vírgula)"
                defaultValue={notetype.checkslabels.join(', ')}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="checkslabels-error"
              />
              <CheckCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
      </div>

      {/*Botões de Ação*/}
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/manager/types"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancelar
        </Link>
        <Button type="submit">Editar</Button>
      </div>
    </form>
  );
}
