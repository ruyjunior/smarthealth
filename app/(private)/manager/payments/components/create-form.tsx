'use client';
import React, { useState, useActionState, useTransition } from 'react';
import Link from 'next/link';
import { TagIcon, CurrencyDollarIcon, ChatBubbleBottomCenterTextIcon, CalendarDateRangeIcon } from '@heroicons/react/24/outline';
import { Button } from '@/app/components/ui/button';
import { createPayment, State } from '@/app/query/payments/actions';
import { formatDateBr } from '@/app/lib/utils';
import Loading from '@/app/components/ui/loading';
import { formatCurrencyInput } from '@/app/lib/utils';



export default function Form({ idclinic }: { idclinic: string }) {

  const initialState: State = { message: '', errors: {} };
  const [state, formAction] = useActionState(createPayment, initialState);
  const [isPending, startTransition] = useTransition();

  const today = new Date();
  const [date, setDate] = useState(today.toISOString().split('T')[0]);

  const handleChangeDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formattedDate = formatDateBr(event.target.value);
    setDate(formattedDate);
  };
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    startTransition(() => {
      formAction(new FormData(e.currentTarget));
    });
  };

  return (
    <form onSubmit={handleSubmit}>

      {/* Mensagem Carregando */}
      {isPending ? (
        <Loading />
      ) : (
        <div className="rounded-md bg-gray-50 p-4 md:p-6">

          <input type="hidden" name="idclinic" value={idclinic} />
          <span className="text-sm text-gray-500">
            Os campos com * são obrigatórios.
          </span>

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
                  required
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

          {/* Description */}
          <div className="mb-4">
            <label htmlFor="description" className="mb-2 block text-sm font-medium">
              Descrição
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="description"
                  name="description"
                  type="text"
                  required
                  placeholder="Insira uma descrição"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="description-error"
                />
                <ChatBubbleBottomCenterTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
              <div id="description-error" aria-live="polite" aria-atomic="true">
                {state.errors?.description &&
                  state.errors.description.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>
          </div>

          {/* Amount */}
          <div className="mb-4">
            <label htmlFor="amount" className="mb-2 block text-sm font-medium">
              Valor
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="amount"
                  name="amount"
                  type="currency"
                  required
                  placeholder="Insira um valor"
                  onChange={(e) => {
                    e.target.value = formatCurrencyInput(e.target.value);
                  }}
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="amount-error"
                />
                <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>

          {/* Data */}
          <div className="mb-4">
            <label htmlFor="date" className="mb-2 block text-sm font-medium">
              Data*
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
                  required
                  placeholder="Enter a birth"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="birth-error"
                />
                <CalendarDateRangeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Botões de ação */}
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/manager/payments"
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
