'use client'
import { AtSymbolIcon, KeyIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { useActionState } from 'react';
import { authenticate } from '@/app/lib/authenticate';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/app/components/ui/button';

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <form action={formAction} className="w-full max-w-md rounded-xl bg-white shadow-lg px-8 py-10">
        <h1 className="mb-1 text-3xl font-bold text-blue-700 text-center">
          Acesse sua conta
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-2 block text-sm font-medium text-blue-900"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-lg border border-blue-200 py-3 pl-10 text-base outline-none placeholder:text-blue-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                id="email"
                type="email"
                name="email"
                placeholder="Digite seu email"
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-300 peer-focus:text-blue-500" />
            </div>
          </div>
          <div className="mt-6">
            <label
              className="mb-2 block text-sm font-medium text-blue-900"
              htmlFor="password"
            >
              Senha
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-lg border border-blue-200 py-3 pl-10 text-base outline-none placeholder:text-blue-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                id="password"
                type="password"
                name="password"
                placeholder="Digite sua senha"
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-300 peer-focus:text-blue-500" />
            </div>
          </div>
        </div>
        <input type="hidden" name="redirectTo" value={callbackUrl} />
        <Button
          className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
          aria-disabled={isPending}
        >
          Log in <ArrowRightIcon className="h-5 w-5 text-white" />
        </Button>
        <div
          className="flex h-8 items-end space-x-2 justify-center mt-2"
          aria-live="polite"
          aria-atomic="true"
        >
          {errorMessage && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
        </div>
      </form>
    </div>
  );
}