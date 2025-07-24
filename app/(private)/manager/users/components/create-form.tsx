'use client';
import { useActionState, useTransition } from 'react';
import Link from 'next/link';
import { TagIcon, AtSymbolIcon, KeyIcon, IdentificationIcon } from '@heroicons/react/24/outline';
import { Button } from '@/app/components/ui/button';
import { createUser, State } from '@/app/query/users/actions';
import  Loading  from '@/app/components/ui/loading';

export default function Form({ id } : { id: string | undefined }) {

  const initialState: State = { message: '', errors: {} };
  
  const [state, formAction] = useActionState(createUser, initialState);

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

          {/* NAME and Pronoun */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium">
              Pronome e Nome
            </label>
            <div className="flex flex-col md:flex-row gap-2">
              {/* Pronome */}
              <div className="relative flex-1 md:max-w-[140px]">
                <select
                  id="pronoun"
                  name="pronoun"
                  className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  defaultValue="Dr."
                >
                  <option value="" disabled>
                    Selecione um Pronome
                  </option>
                  <option value="Dr.">Dr.</option>
                  <option value="Dra.">Dra.</option>
                  <option value="Sr.">Sr.</option>
                  <option value="Sra.">Sra.</option>
                  <option value="Srta.">Srta.</option>
                </select>
                <TagIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>

              {/* Nome */}
              <div className="relative flex-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Insira um nome"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="name-error"
                />
                <TagIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                <div id="name-error" aria-live="polite" aria-atomic="true">
                  {state.errors?.name &&
                    state.errors.name.map((error: string) => (
                      <p className="mt-2 text-sm text-red-500" key={error}>
                        {error}
                      </p>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* EMAIL */}
          <div className="mb-4">
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Email
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="Insira um email"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="email-error"
                />
                <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
              <div id="email-error" aria-live="polite" aria-atomic="true">
                {state.errors?.email &&
                  state.errors.email.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>
          </div>

          {/*
        {/* PASSWORD 
        <div className="mb-4">
          <label htmlFor="password" className="mb-2 block text-sm font-medium">
            Senha
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Insira uma senha"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="password-error"
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="password-error" aria-live="polite" aria-atomic="true">
              {state.errors?.password &&
                state.errors.password.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>
*/}
          {/* Categoria */}
          <div className="mb-4">
            <label htmlFor="category" className="mb-2 block text-sm font-medium">
              Identificação profissional
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="category"
                  name="category"
                  type="text"
                  placeholder="Insira categoria da classe"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="category-error"
                />
                <IdentificationIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
              <div id="category-error" aria-live="polite" aria-atomic="true">
                {state.errors?.category &&
                  state.errors.category.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>
          </div>

          {/* Role */}
          <input type="hidden" name="role" value="Funcionário" />

        </div>
      )}


      {/* Botões de Ação */}
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/manager/users"
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
