'use client';
import { useActionState, use } from 'react';
import React, { useState } from 'react';
import { Client } from '@/app/query/clients/definitions';
import {
  IdentificationIcon, PhoneIcon, TagIcon, TruckIcon, CurrencyDollarIcon,
  AtSymbolIcon, CalendarDateRangeIcon, BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { updateClient, State } from '@/app/query/clients/actions';
import { formatCPF, formatCEP, formatPhone, formatDateDb } from '@/app/lib/utils';

export default function EditClientForm({
  client,
}: {
  client: Client;
}) {

  const initialState: State = { message: '', errors: {} };
  const updateClientWithId = updateClient.bind(null, client.id);
  const [state, formAction] = useActionState(updateClientWithId, initialState);

  const [phone, setPhone] = useState(formatPhone(client.phone));
  const [cep, setCEP] = useState(formatCEP(client.cep));
  const [cpf, setCPF] = useState(formatCPF(client.cpf));

  if (!client.birth) {
    client.birth = '';
  }
  const birth = formatDateDb(client.birth);

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
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">

        {/* NAME */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Nome
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Insira um nome"
                defaultValue={client.name}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="name-error"
              />
              <TagIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
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
                placeholder="Insira um email"
                defaultValue={client.email}
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

        {/* BIRTH */}
        <div className="mb-4">
          <label htmlFor="birth" className="mb-2 block text-sm font-medium">
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
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="birth-error"
              />
              <CalendarDateRangeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
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
                placeholder="Insira o telefone"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="phone-error"
              />
              <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
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
                placeholder="Insira o CEP"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="cep-error"
              />
              <TruckIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
      </div>

      {/*Botões de ações */}
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/clients"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancelar
        </Link>
        <Button type="submit">Editar</Button>
      </div>
    </form>
  );
}
