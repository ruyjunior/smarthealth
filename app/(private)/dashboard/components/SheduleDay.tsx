'use client'
import { lusitana } from '@/app/components/ui/fonts';
import { Service } from '@/app/query/services/definitions';
import { User } from '@/app/query/users/definitions';
import { Client } from '@/app/query/clients/definitions';
import { Type } from '@/app/query/types/definitions';
import { Office } from '@/app/query/offices/definitions';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';


export default function SheduleDay(
  { services, users, clients, types, offices }:
    { services: Service[], users: User[], clients: Client[], types: Type[], offices: Office[] }
) {

  return (
    <div className="p-0 mt-4">
      <div className="rounded-xl border bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-lg flex flex-col items-center w-full max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-2">
          <CalendarDaysIcon className="h-8 w-8 text-indigo-500" />
          <h1 className={`${lusitana.className} text-2xl text-blue-900 font-extrabold tracking-tight`}>
            Agenda de Hoje
          </h1>
        </div>
        {/* Desktop: tabela */}
        <div className="hidden md:block w-full">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-blue-100 text-blue-900">
                <th className="py-3 px-3 text-left font-semibold">Horário</th>
                <th className="py-3 px-3 text-left font-semibold">Paciente</th>
                <th className="py-3 px-3 text-left font-semibold">Tipo</th>
                <th className="py-3 px-3 text-left font-semibold">Sala</th>
                <th className="py-3 px-3 text-left font-semibold">Profissional</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s, index) => {
                const client = clients.find(c => c.id === s.idclient);
                const type = types.find(t => t.id === s.idtype);
                const user = users.find(u => u.id === s.iduser);
                const office = offices.find(o => o.id === s.idoffice);

                return (
                  <tr key={index} className="border-b last:border-b-0 hover:bg-blue-50 transition">
                    <td className="py-2 px-3 font-semibold text-blue-800">{s.starttime}</td>
                    <td className="py-2 px-3">{client?.name || '-'}</td>
                    <td className="py-2 px-3">{type?.title || '-'}</td>
                    <td className="py-2 px-3">{office?.title || '-'}</td>
                    <td className="py-2 px-3">Dr.(a) {user?.name || '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* Mobile: cards */}
        <div className="md:hidden w-full space-y-4">
          {services.map((s, index) => {
            const client = clients.find(c => c.id === s.idclient);
            const type = types.find(t => t.id === s.idtype);
            const user = users.find(u => u.id === s.iduser);
            const office = offices.find(o => o.id === s.idoffice);

            return (
              <div key={index} className="rounded-xl border border-blue-200 p-4 shadow bg-white flex flex-col gap-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-blue-900 text-lg">{s.starttime}</span>
                  <span className="text-xs text-blue-700 bg-blue-100 rounded px-2 py-0.5">{type?.title || '-'}</span>
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