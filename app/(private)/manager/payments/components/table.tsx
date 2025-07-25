'use client';
import { UpdatePayment, DeletePayment } from './buttons';
import { formatDateToLocal, formatTime, formatDateDb } from '@/app/lib/utils';
import { formatCurrency } from '@/app/lib/utils';
import { useState } from 'react';
import { DateFilter } from './DateFilter';
import { CreatePayment } from './buttons';

export default function PaymentsTable({
  query, currentPage, payments
}: {
  query: string;
  currentPage: number;
  payments: any[];
}) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredPayments = payments.filter(payment => {
    if (!startDate || !endDate) return true; // Se nenhuma data for selecionada, retorna todos os pagamentos
    const paymentDate = formatDateDb(payment.date);
    return paymentDate >= startDate && paymentDate <= endDate;
  });

  const amount = filteredPayments.reduce((acc, payment) => {
    return acc + Number(payment.amount);
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
        <CreatePayment />
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
                  {filteredPayments?.map((payment) => {

                    return (
                      <div key={payment.id} className="mb-6 w-full rounded-lg bg-blue-300 p-4 shadow-sm">
                        <div className="border-b pb-4">
                          <h3 className="text-xl font-semibold text-gray-900">{formatDateToLocal(payment.date)}</h3>
                          <p className="text-sm text-gray-600">Título: {payment.title}</p>
                          <p className="text-sm text-gray-600">Descrição: {payment.description}</p>
                          <p className="text-sm text-gray-600">Valor: {formatCurrency(Number(payment.amount))}</p>
                        </div>
                        <div className="flex justify-end gap-3 pt-3">
                          <UpdatePayment id={payment.id} />
                          <DeletePayment id={payment.id} />
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Desktop View */}
                <table className="hidden min-w-full text-center text-gray-900 md:table">
                  <thead className="bg-blue-300 text-xs font-medium">
                    <tr>
                      <th className="px-2 py-2">Editar</th>
                      <th className="px-2 py-2">Data</th>
                      <th className="px-2 py-2">Título</th>
                      <th className="px-2 py-2">Descrição</th>
                      <th className="px-2 py-2">Valor</th>
                      <th className="px-2 py-2">Deletar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredPayments.map((payment) => {
                      return (
                        <tr key={payment.id} className="hover:bg-blue-300">
                          <td className="py-2 px-2 flex gap-2 items-center justify-center">
                            <UpdatePayment id={payment.id} />
                          </td>
                          <td className="px-2 py-2 text-xs">{formatDateToLocal(payment.date)}</td>
                          <td className="px-2 py-2 text-xs">{payment.title}</td>
                          <td className="px-2 py-2 text-xs">{payment.description}</td>
                          <td className="px-2 py-2 text-xs">{formatCurrency(Number(payment.amount))}</td>
                          <td className="py-2 px-2 flex justify-center items-center">
                            <DeletePayment id={payment.id} />
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
      </div>
    </div>
  )
}