'use client';
import { formatDateToLocal, formatDateDb } from '@/app/lib/utils';
import { formatCurrency } from '@/app/lib/utils';
import { useState } from 'react';
import { DateFilter } from './DateFilter';
import { Service } from '@/app/domains/services/types';
import { Type } from '@/app/domains/types/types';

export default function PaymentsTable({
  services,
  typesServices,
}: {
  services: Service[];
  typesServices: Type[];
}) {
  const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const lastDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

  const [startDate, setStartDate] = useState(firstDayOfMonth.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(lastDayOfMonth.toISOString().split('T')[0]);

  const filteredServices = services.filter((service) => {
    if (!startDate || !endDate) return service.status === 'Feito'; // Se nenhuma data for selecionada, retorna todos os serviços
    const serviceDate = formatDateDb(service.date);
    return serviceDate >= startDate && serviceDate <= endDate && service.status === 'Feito';
  });

  const amount = filteredServices.reduce((acc, service) => {
    const serviceType = typesServices.find((t) => t.id === service.idtype);
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
              <div className="overflow-hidden rounded-[2rem] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-3 shadow-[0_25px_80px_rgba(59,130,246,0.08)] md:p-5">
                {/* Mobile View */}
                <div className="md:hidden">
                  {filteredServices?.map((service) => {
                    const serviceType = typesServices.find((t) => t.id === service.idtype);
                    const price = Number(serviceType?.price || 0);

                    return (
                      <div
                        key={service.id}
                        className="mb-4 w-full rounded-[1.5rem] border border-blue-100 bg-white p-4 shadow-sm shadow-blue-100"
                      >
                        <div className="border-b pb-4">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {formatDateToLocal(service.date)}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Data: {formatDateToLocal(service.date)}
                          </p>
                          <p className="text-sm text-gray-600">Tipo: {serviceType?.title}</p>
                          <p className="text-sm text-gray-600">
                            Valor: {formatCurrency(Number(price))}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Desktop View */}
                <table className="hidden min-w-full text-center text-gray-900 md:table">
                  <thead className="bg-gradient-to-r from-blue-700 to-indigo-700 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                    <tr>
                      <th className="px-2 py-2">Data</th>
                      <th className="px-2 py-2">Título</th>
                      <th className="px-2 py-2">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredServices?.map((service) => {
                      const serviceType = typesServices.find((t) => t.id === service.idtype);
                      const price = Number(serviceType?.price || 0);

                      return (
                        <tr key={service.id} className="bg-white/80 transition hover:bg-blue-50/80">
                          <td className="px-2 py-2 text-xs">{formatDateToLocal(service.date)}</td>
                          <td className="px-2 py-2 text-xs">{serviceType?.title}</td>
                          <td className="px-2 py-2 text-xs">{formatCurrency(price)}</td>
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
    </div>
  );
}
