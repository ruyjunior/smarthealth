'use client';
import { formatDateToLocal, formatDateDb } from '@/app/lib/utils';
import { formatCurrency } from '@/app/lib/utils';
import { useState } from 'react';
import { DateFilter } from './DateFilter';
import { Service } from '@/app/query/services/definitions';
import { Type } from '@/app/query/types/definitions';
import { User } from '@/app/query/users/definitions';

export default function PaymentsTable({
  query, currentPage, services, typesServices, users
}: {
  query: string;
  currentPage: number;
  services: Service[];
  typesServices: Type[];
  users: User[];
}) {
  const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const lastDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

  const [startDate, setStartDate] = useState(firstDayOfMonth.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(lastDayOfMonth.toISOString().split('T')[0]);

  const filteredServices = services.filter(service => {
    if (!startDate || !endDate) return service.status === 'Feito'; // Se nenhuma data for selecionada, retorna todos os serviços
    const serviceDate = formatDateDb(service.date);
    return serviceDate >= startDate && serviceDate <= endDate && service.status === 'Feito';
  });

  const amount = filteredServices.reduce((acc, service) => {
    const serviceType = typesServices.find(t => t.id === service.idtype);
    const price = Number(serviceType?.price || 0);
    return acc + price;
  }, 0);

  return (
    <div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <DateFilter
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
      </div>
      <div>
        <h4 className="text-lg font-semibold text-gray-900">Total:</h4>
        <p className="text-xl font-bold text-gray-900">{formatCurrency(amount)}</p>
      </div>
      <div className="w-full">
        <div className="mt-6 flow-root">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden rounded-lg bg-blue-200 shadow-md p-4 md:pt-0">
                {/* Mobile View */}
                <div className="md:hidden">
                  {filteredServices?.map((service) => {
                    const serviceType = typesServices.find(t => t.id === service.idtype);
                    const price = Number(serviceType?.price || 0);
                    const user = users.find(u => u.id === service.iduser);

                    return (
                      <div key={service.id} className="mb-6 w-full rounded-lg bg-blue-300 p-4 shadow-sm">
                        <div className="border-b pb-4">
                          <h3 className="text-xl font-semibold text-gray-900">{formatDateToLocal(service.date)}</h3>
                          <p className="text-sm text-gray-600">Data: {formatDateToLocal(service.date)}</p>
                          <p className="text-sm text-gray-600">Tipo: {serviceType?.title}</p>
                          <p className="text-sm text-gray-600">Valor: {formatCurrency(Number(price))}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Desktop View */}
                <table className="hidden min-w-full text-center text-gray-900 md:table">
                  <thead className="bg-blue-300 text-xs font-medium">
                    <tr>
                      <th className="px-2 py-2">Data</th>
                      <th className="px-2 py-2">Título</th>
                      <th className="px-2 py-2">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredServices?.map((service) => {
                      const serviceType = typesServices.find(t => t.id === service.idtype);
                      const price = Number(serviceType?.price || 0);
                      const user = users.find(u => u.id === service.iduser);

                      return (
                        <tr key={service.id} className="hover:bg-blue-300">
                          <td className="px-2 py-2 text-xs">{formatDateToLocal(service.date)}</td>
                          <td className="px-2 py-2 text-xs">{serviceType?.title}</td>
                          <td className="px-2 py-2 text-xs">{formatCurrency(price)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}