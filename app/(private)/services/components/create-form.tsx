'use client';
import React, { useState, useActionState, useTransition } from 'react';
import Link from 'next/link';
import { UserGroupIcon, UserCircleIcon, CalendarDateRangeIcon, ClockIcon, BuildingOffice2Icon, QueueListIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '@/app/components/ui/button';
import { createService, State } from '@/app/query/services/actions';
import { Office } from '@/app/query/offices/definitions';
import { Client } from '@/app/query/clients/definitions';
import { formatDateBr } from '@/app/lib/utils';
import { Type } from '@/app/query/types/definitions';
import { User } from '@/app/query/users/definitions';
import Loading from '@/app/components/ui/loading';


export default function Form({ data }: { data: any }) {

  const { clients, offices, types, users, idclinic } = data;

  const initialState: State = { message: '', errors: {} };
  const [state, formAction] = useActionState(createService, initialState);
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState('');
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [isSearching, startTransitionSearch] = useTransition();

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
  // Busca clientes conforme digitação
  const normalize = (str: string) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const handleClientSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    if (value.length >= 3) {
      startTransitionSearch(() => {
        setFilteredClients(
          clients.filter((client: Client) =>
            normalize(client.name).includes(normalize(value))
          )
        );
      });
    } else {
      setFilteredClients([]);
    }
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

          {/* Especialidade */}
          <div className="mb-4">
            <label htmlFor="idtype" className="mb-2 block text-sm font-medium">
              Especialidade*
            </label>
            <div className="relative">
              <select
                id="idtype"
                name="idtype"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                defaultValue=""
                aria-describedby="provider-error"
                required
              >
                <option value="" disabled>
                  Selecione uma especialidade
                </option>
                {types?.map((type: Type) => (
                  <option key={type.id} value={type.id}>
                    {type.title}
                  </option>
                ))}
              </select>
              <QueueListIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
            <div id="base-error" aria-live="polite" aria-atomic="true">
              {state.errors?.idtype &&
                state.errors.idtype.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>

          {/* User */}
          <div className="mb-4">
            <label htmlFor="iduser" className="mb-2 block text-sm font-medium">
              Profissional*
            </label>
            <div className="relative">
              <select
                id="iduser"
                name="iduser"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                defaultValue=""
                aria-describedby="iduser-error"
                required
              >
                <option value="" disabled>
                  Selecione um Profissional
                </option>
                {users?.map((user: User) => (
                  <option key={user.id} value={user.id}>
                    {user.pronoun} {user.name}
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

          {/* Consultório */}
          <div className="mb-4">
            <label htmlFor="idprovider" className="mb-2 block text-sm font-medium">
              Consultório*
            </label>
            <div className="relative">
              <select
                id="idoffice"
                name="idoffice"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                defaultValue=""
                aria-describedby="provider-error"
                required
              >
                <option value="" disabled>
                  Selecione um consultório
                </option>
                {offices?.map((office: Office) => (
                  <option key={office.id} value={office.id}>
                    {office.title}
                  </option>
                ))}
              </select>
              <BuildingOffice2Icon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
            <div id="base-error" aria-live="polite" aria-atomic="true">
              {state.errors?.idoffice &&
                state.errors.idoffice.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>

          {/* Paciente 
          <div className="mb-4">
            <label htmlFor="idclient" className="mb-2 block text-sm font-medium">
              Paciente
            </label>
            <div className="relative">
              <select
                id="idclient"
                name="idclient"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                defaultValue=""
                aria-describedby="provider-error"
                required
              >
                <option value="" disabled>
                  Selecione um paciente
                </option>
                {clients?.map((client: Client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
            <div id="base-error" aria-live="polite" aria-atomic="true">
              {state.errors?.idclient &&
                state.errors.idclient.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div > */}

          {/* Paciente com busca */}
          <div className="mb-4">
            <label htmlFor="idclient" className="mb-2 block text-sm font-medium">
              Paciente*
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Busque o paciente (mín. 3 letras)"
                value={search}
                onChange={handleClientSearch}
                className="block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 mb-2"
              />
              <UserCircleIcon className="pointer-events-none absolute left-3 top-3 h-[18px] w-[18px] text-gray-500" />
              <select
                id="idclient"
                name="idclient"
                className={`peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500
    ${filteredClients.length > 0 ? 'ring-2 ring-blue-200' : ''}`}
                defaultValue=""
                required
                disabled={filteredClients.length === 0}
              >
                <option value="" disabled>
                  {search.length < 3
                    ? "Digite pelo menos 3 letras para buscar"
                    : filteredClients.length === 0
                      ? "Nenhum paciente encontrado"
                      : "Selecione um paciente"}
                </option>
                {filteredClients.map((client: Client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>
            <div id="base-error" aria-live="polite" aria-atomic="true">
              {state.errors?.idclient &&
                state.errors.idclient.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
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

          {/* Start Time */}
          <div className="mb-4">
            <label htmlFor="starttime" className="mb-2 block text-sm font-medium">
              Horário de Início*
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="starttime"
                  name="starttime"
                  type="time"
                  required
                  defaultValue="12:00"
                  placeholder="Insira um horário de início"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="enddate-error"
                />
                <ClockIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>

          {/* End Time */}
          <div className="mb-4">
            <label htmlFor="endtime" className="mb-2 block text-sm font-medium">
              Horário de Fim*
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="endtime"
                  name="endtime"
                  type="time"
                  defaultValue="12:50"
                  required
                  placeholder="Insira um horário de fim"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="enddate-error"
                />
                <ClockIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="mb-4">
            <label htmlFor="status" className="mb-2 block text-sm font-medium">
              Escolha o estado*
            </label>
            <div className="relative">
              <select
                id="status"
                name="status"
                defaultValue="Marcada"
                required
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="status-error"
              >
                <option value="" disabled> Selecione a situação </option>
                <option value="Vazia"> Vazia </option>
                <option value="Marcada"> Marcada </option>
                <option value="Feito"> Feito </option>
              </select>
              <QuestionMarkCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
            <div id="status-error" aria-live="polite" aria-atomic="true">
              {state.errors?.status &&
                state.errors.status.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>

        </div>
      )}

      {/* Botões de ação */}
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/services"
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
