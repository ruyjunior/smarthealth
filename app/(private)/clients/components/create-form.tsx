'use client';
import { useActionState, useTransition } from 'react';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  IdentificationIcon, PhoneIcon, TagIcon, TruckIcon, AtSymbolIcon, CalendarDateRangeIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/components/ui/button';
import { createClient, State } from '@/app/query/clients/actions';
import { formatCPF, formatCEP, formatPhone, formatDateBr } from '@/app/lib/utils';
import Image from 'next/image';


export default function Form({ id }: { id: string | undefined }) {
  const initialState: State = { message: null, errors: {} };
  const [state, formAction] = useActionState(createClient, initialState);
  const [isPending, startTransition] = useTransition();

  const [phone, setPhone] = useState('');
  const [cep, setCEP] = useState('');
  const [cpf, setCPF] = useState('');
  const [birth, setBirth] = useState('');

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
  const handleChangeBirth = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formattedBirth = formatDateBr(event.target.value);
    setBirth(formattedBirth);
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
                  defaultValue="Sr."
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

          {/* CPF */}
          <div className="mb-4">
            <label htmlFor="cpf" className="mb-2 block text-sm font-medium">
              CPF
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="cpf"
                  name="cpf"
                  type="text"
                  required
                  value={cpf}
                  maxLength={14}
                  onChange={handleChangeCPF}
                  placeholder="Insira um CPF"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="cpf-error"
                />
                <IdentificationIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>

          {/* PHONE */}
          <div className="mb-4">
            <label htmlFor="phone" className="mb-2 block text-sm font-medium">
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
                  placeholder="Insira um telefone"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="phone-error"
                />
                <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
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
                  type="text"
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

          {/* BIRTH */}
          <div className="mb-4">
            <label htmlFor="birth" className="mb-2 block text-sm font-medium">
              Nascimento
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="birth"
                  name="birth"
                  type="date"
                  //value={birth}
                  maxLength={10}
                  //onChange={handleChangeBirth}
                  placeholder="Insira o nascimento"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="birth-error"
                />
                <CalendarDateRangeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>

          {/* CEP */}
          <div className="mb-4">
            <label htmlFor="cep" className="mb-2 block text-sm font-medium">
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
                  placeholder="Insira um CEP"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="cep-error"
                />
                <TruckIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>

        </div>

      )}

      {/*Botões de ações */}
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/clients"
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
