'use client'
import { lusitana } from '@/app/components/ui/fonts';
import { Service } from '@/app/query/services/definitions';
import { User } from '@/app/query/users/definitions';
import { Client } from '@/app/query/clients/definitions';
import { Type } from '@/app/query/types/definitions';
import { Office } from '@/app/query/offices/definitions';

export default function SheduleDay(
  { services, users, clients, types, offices }:
    { services: Service[], users: User[], clients: Client[], types: Type[], offices: Office[] }) {

  return (
    <div className="p-0 mt-4">
      <h1 className={`${lusitana.className} text-2xl mb-4`}>Agendamentos do dia</h1>
      <div className="rounded-lg border bg-white opacity-90 p-4 shadow-sm">
        {/* Desktop: tabela, Mobile: cards */}
        <div className="hidden md:block">
          <table className="min-w-full text-xs">
            <thead>
              <tr className="bg-blue-100 text-gray-700">
                <th className="py-2 px-2 text-left">Horário</th>
                <th className="py-2 px-2 text-left">Paciente</th>
                <th className="py-2 px-2 text-left">Tipo</th>
                <th className="py-2 px-2 text-left">Sala</th>
                <th className="py-2 px-2 text-left">Profissional</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s, index) => {
                const client = clients.find(c => c.id === s.idclient);
                const type = types.find(t => t.id === s.idtype);
                const user = users.find(u => u.id === s.iduser);
                const office = offices.find(o => o.id === s.idoffice);

                return (
                  <tr key={index} className="border-b last:border-b-0 hover:bg-blue-50">
                    <td className="py-2 px-2">{s.starttime}</td>
                    <td className="py-2 px-2">{client?.name || '-'}</td>
                    <td className="py-2 px-2">{type?.title || '-'}</td>
                    <td className="py-2 px-2">{office?.title || '-'}</td>
                    <td className="py-2 px-2">Dr.(a) {user?.name || '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* Mobile: cards */}
        <div className="md:hidden space-y-4">
          {services.map((s, index) => {
            const client = clients.find(c => c.id === s.idclient);
            const type = types.find(t => t.id === s.idtype);
            const user = users.find(u => u.id === s.iduser);
            const office = offices.find(o => o.id === s.idoffice);

            return (
              <div key={index} className="rounded border p-3 shadow-sm bg-blue-50">
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-blue-900">{s.starttime}</span>
                  <span className="text-xs text-gray-500">{type?.title || '-'}</span>
                </div>
                <div className="mb-1">
                  <span className="block font-medium text-gray-800">{client?.name || '-'}</span>
                  <span className="block text-xs text-gray-600">{office?.title || '-'}</span>
                </div>
                <div className="text-xs text-blue-800">
                  Dr.(a) {user?.name || '-'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}