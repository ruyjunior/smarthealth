'use client';
import { useActionState, useTransition } from 'react';
import React, { useState } from 'react';
import { Client } from '@/app/domains/clients/types';
import {
  IdentificationIcon,
  PhoneIcon,
  TagIcon,
  TruckIcon,
  AtSymbolIcon,
  CalendarDateRangeIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { updateClient, State } from '@/app/domains/clients/actions';
import { formatCPF, formatCEP, formatPhone, formatDateDb } from '@/app/lib/utils';
import Image from 'next/image';

export default function EditClientForm({ client }: { client: Client }) {
  const initialState: State = { message: '', errors: {} };
  const updateClientWithId = updateClient.bind(null, client.id);
  const [state, formAction] = useActionState(updateClientWithId, initialState);

  const [isPending, startTransition] = useTransition();
  const [uploading] = useState(false);

  const [phone, setPhone] = useState(formatPhone(client.phone));
  const [cep, setCEP] = useState(formatCEP(client.cep));
  const [cpf, setCPF] = useState(formatCPF(client.cpf));

  if (!client.birth) {
    client.birth = '';
  }
  const birth = formatDateDb(client.birth);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    startTransition(() => {
      formAction(new FormData(e.currentTarget));
    });
  }

  const handleChangePhone = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhone(event.target.value);
    setPhone(formattedPhone);
  };
  const handleChangeCEP = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCEP = formatCEP(event.target.value);
    setCEP(formattedCEP);
  };
  const handleChangeCPF = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCPF = formatCPF(event.target.value);
    setCPF(formattedCPF);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-5xl rounded-[2rem] border border-blue-100 bg-white p-4 shadow-[0_25px_80px_rgba(37,99,235,0.1)] sm:p-6 md:p-8"
    >
      {/* Mensagem Carregando */}
      {isPending ? (
        <div className="flex flex-col items-center justify-center min-h-[200px] gap-2 text-blue-700">
          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
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
          Processando...
          <Image src="/ecg.gif" alt="logo App" width={200} height={200} />
        </div>
      ) : (
        <div className="grid gap-x-6 md:grid-cols-2">
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 md:col-span-2">
            <IdentificationIcon className="h-6 w-6 shrink-0 text-blue-600" />
            <span className="text-sm leading-relaxed text-slate-600">
              Os campos com * são obrigatórios.
            </span>
          </div>

          {/* NAME and Pronoun */}
          <div className="mb-5 md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Pronome e Nome*
            </label>
            <div className="flex flex-col md:flex-row gap-2">
              {/* Pronome */}
              <div className="relative flex-1 md:max-w-[160px]">
                <select
                  id="pronoun"
                  name="pronoun"
                  className="peer block min-h-12 w-full cursor-pointer rounded-xl border border-slate-200 bg-white py-3 pl-10 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                  defaultValue={client.pronoun}
                >
                  <option value="" disabled>
                    Selecione um Pronome
                  </option>
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
                  defaultValue={client.name}
                  placeholder="Insira um nome"
                  className="peer block min-h-12 w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                  aria-describedby="name-error"
                />
                <TagIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                <div id="name-error" aria-live="polite" aria-atomic="true">
                  {state.errors?.name &&
                    state.errors.name.map((error: string) => (
                      <p className="mt-2 text-sm font-medium text-red-600" key={error}>
                        {error}
                      </p>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* CPF */}
          <div className="mb-5">
            <label htmlFor="cpf" className="mb-2 block text-sm font-semibold text-slate-700">
              CPF*
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="cpf"
                  name="cpf"
                  type="text"
                  value={cpf}
                  maxLength={14}
                  onChange={handleChangeCPF}
                  placeholder="Insira um CPF"
                  className="peer block min-h-12 w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                  aria-describedby="cpf-error"
                />
                <IdentificationIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>

          {/* PHONE */}
          <div className="mb-5">
            <label htmlFor="phone" className="mb-2 block text-sm font-semibold text-slate-700">
              Telefone
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  value={phone}
                  maxLength={15}
                  onChange={handleChangePhone}
                  placeholder="Insira o telefone"
                  className="peer block min-h-12 w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                  aria-describedby="phone-error"
                />
                <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>

          {/* EMAIL */}
          <div className="mb-5">
            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
              Email
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Insira um email"
                  defaultValue={client.email}
                  className="peer block min-h-12 w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                  aria-describedby="email-error"
                />
                <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
              <div id="email-error" aria-live="polite" aria-atomic="true">
                {state.errors?.email &&
                  state.errors.email.map((error: string) => (
                    <p className="mt-2 text-sm font-medium text-red-600" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>
          </div>

          {/* BIRTH */}
          <div className="mb-5">
            <label htmlFor="birth" className="mb-2 block text-sm font-semibold text-slate-700">
              Data de Nascimento
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="birth"
                  name="birth"
                  type="date"
                  defaultValue={birth}
                  maxLength={10}
                  //onChange={handleChangeBirth}
                  placeholder="Insira o nascimento"
                  className="peer block min-h-12 w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                  aria-describedby="birth-error"
                />
                <CalendarDateRangeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>

          {/* CEP */}
          <div className="mb-5">
            <label htmlFor="cep" className="mb-2 block text-sm font-semibold text-slate-700">
              CEP
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="cep"
                  name="cep"
                  type="text"
                  value={cep}
                  maxLength={9}
                  onChange={handleChangeCEP}
                  placeholder="Insira o CEP"
                  className="peer block min-h-12 w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                  aria-describedby="cep-error"
                />
                <TruckIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/*Botões de ações */}
      <div className="mt-8 flex flex-col-reverse justify-end gap-3 border-t border-slate-100 pt-6 sm:flex-row">
        <Link
          href="/clients"
          className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          Cancelar
        </Link>
        <Button
          type="submit"
          disabled={isPending || uploading}
          aria-disabled={isPending || uploading}
        >
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
