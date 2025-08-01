'use client';
import { UserGroupIcon, CalendarIcon, CurrencyDollarIcon, StarIcon, NewspaperIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/components/ui/fonts';
import { Service } from '@/app/query/services/definitions';
import { User } from '@/app/query/users/definitions';
import { Client } from '@/app/query/clients/definitions';
import { Type } from '@/app/query/types/definitions';
import { Office } from '@/app/query/offices/definitions';
import { formatCurrency } from '@/app/lib/utils';

export default function ResumeWeek(
    { services, users, clients, types, offices }:
        { services: Service[], users: User[], clients: Client[], types: Type[], offices: Office[] }
) {

    const totalServices = services.length;
    const totalDoneServices = services.filter(s => s.status === 'Feito').length;
    const totalBusyServices = services.filter(s => s.status === 'Marcada').length;
    const totalEmptyServices = services.filter(s => s.status === 'Vazia').length;
    const topServices = services.slice(0, 3);

    const totalRevenue = services
        .filter(service => service.status === 'Feito')
        .reduce((acc, service) => {
            const type = types.find(t => t.id === service.idtype);
            return acc + (type ? Number(type.price) : 0);
        }, 0);

    return (
        <div className="flex w-full items-center justify-between p-4">
            <div className="rounded-xl border bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-lg flex flex-col items-center w-full max-w-5xl mx-auto">
                <div className="flex items-center gap-2 mb-2">
                    <NewspaperIcon className="h-8 w-8 text-indigo-500" />
                    <h1 className={`${lusitana.className} text-2xl text-blue-900 font-extrabold tracking-tight`}>
                        Resumo Semanal
                    </h1>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                    <div className="bg-white rounded-xl shadow flex flex-col items-center p-5 border-t-4 border-blue-400">
                        <UserGroupIcon className="h-8 w-8 text-blue-500 mb-2" />
                        <h2 className="text-base font-semibold text-blue-900 mb-1">Atendimentos Realizados</h2>
                        <p className="text-2xl font-bold text-blue-700">{totalDoneServices}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow flex flex-col items-center p-5 border-t-4 border-green-400">
                        <CalendarIcon className="h-8 w-8 text-green-500 mb-2" />
                        <h2 className="text-base font-semibold text-blue-900 mb-1">Horários Vagos</h2>
                        <p className="text-2xl font-bold text-green-700">{totalEmptyServices}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow flex flex-col items-center p-5 border-t-4 border-yellow-400">
                        <StarIcon className="h-8 w-8 text-yellow-500 mb-2" />
                        <h2 className="text-base font-semibold text-blue-900 mb-1">Atendimentos Populares</h2>
                        <p className="text-sm text-yellow-700 text-center">
                            {topServices.map(service => {
                                const type = types.find(t => t.id === service.idtype);
                                return type ? type.title : 'Desconhecido';
                            }).join(', ')}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow flex flex-col items-center p-5 border-t-4 border-indigo-400">
                        <CurrencyDollarIcon className="h-8 w-8 text-indigo-500 mb-2" />
                        <h2 className="text-base font-semibold text-blue-900 mb-1">Receita</h2>
                        <p className="text-2xl font-bold text-indigo-700">R$ {formatCurrency(totalRevenue)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}