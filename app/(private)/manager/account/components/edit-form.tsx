'use client';
import { useActionState, useState, useTransition } from 'react';
import { Credit } from '@/app/query/credit/definitions';
import { User } from '@/app/query/users/definitions';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { update, State } from '@/app/query/credit/actions';
import Loading from '@/app/components/ui/loading';
import { UserGroupIcon } from '@heroicons/react/24/outline';


export default function EditForm({ credit, users }: { credit: Credit, users: User[] }) {
  const initialState: State = { message: undefined, errors: {} };
  const updateWithId = update.bind(null, credit.id);
  const [state, formAction] = useActionState(updateWithId, initialState);
  const [uploading, setUploading] = useState(false);
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

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Profissional*
            </label>
            <div className="relative">
              <select
                id="email"
                name="email"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="email-error"
                defaultValue=""
                required
              >
                <option value="" disabled>
                  Selecione um Usuário para aplicar crédito
                </option>
                {users.map((user: User) => (
                  <option key={user.id} value={user.email}>
                    {user.name} {user.email}
                  </option>
                ))}
              </select>
              <UserGroupIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
            <div id="iduser-error" aria-live="polite" aria-atomic="true">
              {state.errors?.email &&
                state.errors.email.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>

      )};

      {/* Botões */}
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/manager/account"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancelar
        </Link>
        <Button type="submit" disabled={isPending} aria-disabled={isPending || uploading}>
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