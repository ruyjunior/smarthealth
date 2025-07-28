import { ButtonDelete } from '@/app/components/ui/buttonDelete';
import { UpdateClient, DeleteClient, ViewClient, CallWhatsapp } from './buttons';
import { deleteClient } from '@/app/query/clients/actions';

import {
  formatDateToLocal, formatCurrency,
  formatCPF, formatCEP, formatPhone
} from '@/app/lib/utils';
import { fetchFilteredClients } from '@/app/query/clients/data';

export default async function ClientsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number | undefined | null;
}) {
  const clients = await fetchFilteredClients(query, currentPage);

  return (
    <div className="w-full">
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-lg bg-blue-200 shadow-md p-4 md:pt-0">
              {/* Mobile View */}
              <div className="md:hidden">
                {clients?.map((client) => {
                  return (
                    <div key={client.id} className="mb-6 w-full rounded-lg bg-blue-300 p-4 shadow-sm">
                      <div className="border-b pb-4">
                        <h3 className="text-xl font-semibold text-gray-900">{client.pronoun} {client.name}</h3>
                        <p className="text-sm text-gray-600">Email: {client.email}</p>
                        <p className="text-sm text-gray-600">Phone: {formatPhone(client.phone)}</p>
                      </div>
                      <div className="flex justify-end gap-3 pt-3">
                        {client.phone && <CallWhatsapp phone={client.phone?.replace(/\D/g, '')} />}
                        <ViewClient id={client.id} />
                        <UpdateClient id={client.id} />
                        <DeleteClient id={client.id} />
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Desktop View */}
              <table className="hidden min-w-full text-gray-900 text-center md:table">
                <thead className="bg-blue-300 text-xs font-medium">
                  <tr>
                    <th className="px-2 py-2">Editar</th>
                    <th className="px-2 py-2">Nome</th>
                    <th className="px-2 py-2">CPF</th>
                    <th className="px-2 py-2">Nasc.:</th>
                    <th className="px-2 py-2">Email</th>
                    <th className="px-2 py-2">Telefone</th>
                    <th className="px-2 py-2">CEP</th>
                    <th className="px-2 py-2">Deletar</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {clients.map((client) => {
                    return (
                      <tr key={client.id} className="hover:bg-blue-300">
                        <td className="py-2 px-2">
                          <div className="flex gap-2 items-center justify-center">
                            <ViewClient id={client.id} />
                            <UpdateClient id={client.id} />
                          </div>
                        </td>
                        <td className="px-2 py-2 text-xs align-middle">{client.pronoun} {client.name}</td>
                        <td className="px-2 py-2 text-xs align-middle">{formatCPF(client.cpf)}</td>
                        <td className="px-2 py-2 text-xs align-middle">{client.birth ? formatDateToLocal(client.birth) : ''}</td>
                        <td className="px-2 py-2 text-xs align-middle">{client.email}</td>
                        <td className="py-2 px-2 text-xs">
                          <div className="flex gap-1 items-center justify-center">
                            {formatPhone(client.phone)}
                            {client.phone && <CallWhatsapp phone={client.phone?.replace(/\D/g, '')} />}
                          </div>
                        </td>
                        <td className="px-2 py-2 text-xs align-middle">{formatCEP(client.cep)}</td>
                        <td className="py-2 px-2">
                          <div className="flex justify-center items-center">
                            <DeleteClient id={client.id} />
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}
