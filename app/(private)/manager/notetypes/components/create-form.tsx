'use client';
import { useActionState, useTransition } from 'react';
import Link from 'next/link';
import { TagIcon, CheckCircleIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '@/app/components/ui/button';
import { createNoteType, State } from '@/app/query/notetypes/actions';
import Loading from '@/app/components/ui/loading';

export default function Form({ id }: { id: string | undefined }) {
  const initialState: State = { message: undefined, errors: {} };
  const [state, formAction] = useActionState(createNoteType, initialState);
  const [isPending, startTransition] = useTransition();
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
        <Loading />
      ) : (

        <div className="rounded-md bg-gray-50 p-4 md:p-6">

          {/* ID */}
          <input type="hidden" name="idclinic" value={id} />

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
              Rótulos dos campos de perguntas (Máximo 20)
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="fieldslabels"
                  name="fieldslabels"
                  type="text"
                  placeholder="Insira os rótulos (separadas por vírgula)"
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
              Rótulos das Caixas de seleção (Máximo 20)
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="checkslabels"
                  name="checkslabels"
                  type="text"
                  placeholder="Insira os rótulos (separadas por vírgula)"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="checkslabels-error"
                />
                <CheckCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>
        </div>

      )}

      {/* Botões de ação */}
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/manager/notetypes"
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
