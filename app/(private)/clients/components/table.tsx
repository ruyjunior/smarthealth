import { UpdateClient, DeleteClient, ViewClient, CallWhatsapp } from './buttons';
import { getCurrentClinicId } from '@/app/lib/session';
import { formatDateToLocal, formatCPF, formatCEP, formatPhone } from '@/app/lib/utils';
import { fetchFilteredClients } from '@/app/domains/clients/queries';

export default async function ClientsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number | undefined | null;
}) {
  const idclinic = await getCurrentClinicId();
  const clients = await fetchFilteredClients(idclinic, query, currentPage);

  return (
    <div className="w-full">
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-[2rem] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-3 shadow-[0_25px_80px_rgba(59,130,246,0.08)] md:p-5">
              <div className="md:hidden">
                {clients?.map((client) => {
                  return (
                    <div
                      key={client.id}
                      className="mb-4 w-full rounded-[1.5rem] border border-blue-100 bg-white p-4 shadow-sm shadow-blue-100"
                    >
                      <div className="border-b border-slate-100 pb-4">
                        <h3 className="text-lg font-bold text-slate-800">
                          {client.pronoun} {client.name}
                        </h3>
                        <p className="mt-2 text-sm text-slate-600">Email: {client.email}</p>
                        <p className="text-sm text-slate-600">
                          Telefone: {formatPhone(client.phone)}
                        </p>
                      </div>
                      <div className="mt-4 flex justify-end gap-2">
                        {client.phone && <CallWhatsapp phone={client.phone?.replace(/\D/g, '')} />}
                        <ViewClient id={client.id} />
                        <UpdateClient id={client.id} />
                        <DeleteClient id={client.id} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <table className="hidden min-w-full text-center text-slate-800 md:table">
                <thead className="bg-gradient-to-r from-blue-700 to-indigo-700 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                  <tr>
                    <th className="px-2 py-3">Ações</th>
                    <th className="px-2 py-3">Nome</th>
                    <th className="px-2 py-3">CPF</th>
                    <th className="px-2 py-3">Nasc.</th>
                    <th className="px-2 py-3">Email</th>
                    <th className="px-2 py-3">Telefone</th>
                    <th className="px-2 py-3">CEP</th>
                    <th className="px-2 py-3">Excluir</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {clients.map((client) => {
                    return (
                      <tr key={client.id} className="bg-white/80 transition hover:bg-blue-50/80">
                        <td className="px-2 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <ViewClient id={client.id} />
                            <UpdateClient id={client.id} />
                          </div>
                        </td>
                        <td className="px-2 py-3 text-sm font-semibold align-middle">
                          {client.pronoun} {client.name}
                        </td>
                        <td className="px-2 py-3 text-xs align-middle">{formatCPF(client.cpf)}</td>
                        <td className="px-2 py-3 text-xs align-middle">
                          {client.birth ? formatDateToLocal(client.birth) : ''}
                        </td>
                        <td className="px-2 py-3 text-xs align-middle">{client.email}</td>
                        <td className="px-2 py-3 text-xs align-middle">
                          <div className="flex items-center justify-center gap-2">
                            <span>{formatPhone(client.phone)}</span>
                            {client.phone && (
                              <CallWhatsapp phone={client.phone?.replace(/\D/g, '')} />
                            )}
                          </div>
                        </td>
                        <td className="px-2 py-3 text-xs align-middle">{formatCEP(client.cep)}</td>
                        <td className="px-2 py-3 align-middle">
                          <div className="flex items-center justify-center">
                            <DeleteClient id={client.id} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
