'use client';
import { useState, useEffect } from 'react';
import { formatCurrency } from '@/app/lib/utils';
import { Type } from '@/app/query/types/definitions';
import PdfForm from './pdf-form';
import { User } from '@/app/query/users/definitions';
import { Clinic } from '@/app/query/clinics/definitions';
import { TrashIcon, PlusIcon, PrinterIcon } from '@heroicons/react/24/outline';


export type BudgetItem = {
  type: Type;
  quantity: number;
  total: number;
};

export default function BudgetTable({ types, user, clinic }: { types: Type[], user: User, clinic: Clinic }) {
  const [list, setList] = useState<BudgetItem[]>([]);
  const [selectedTypeId, setSelectedTypeId] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [total, setTotal] = useState(0);
  const [showPDF, setShowPDF] = useState(false);

  useEffect(() => {
    const totalValue = list.reduce((acc, item) => acc + item.total, 0);
    setTotal(totalValue);
  }, [list]);

  const onAddItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const type = types.find(type => type.id === selectedTypeId);
    if (type && quantity) {
      const newItem: BudgetItem = {
        type,
        quantity: Number(quantity),
        total: Number(type.price) * Number(quantity),
      };
      setList(prev => [...prev, newItem]);
      setSelectedTypeId('');
      setQuantity('1');
      setShowPDF(false);
    }
  };

  const onRemoveItem = (index: number) => {
    setList(prev => prev.filter((_, i) => i !== index));
    setShowPDF(false);
  };

  return (
    <div className="w-full">
      {/* Header e total */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:mt-8">
        <div className="flex flex-col md:flex-row items-center gap-4 w-full">
          <form className="flex flex-col md:flex-row items-center gap-2 w-full" onSubmit={onAddItem}>
            <select
              name="typeId"
              id="typeId"
              className="block w-full md:w-auto rounded-md border border-gray-200 py-2 pl-3 pr-10 text-sm outline-2 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-100"
              value={selectedTypeId}
              onChange={e => setSelectedTypeId(e.target.value)}
              required
            >
              <option value="" disabled>Selecione um tipo</option>
              {types.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.title}
                </option>
              ))}
            </select>
            <select
              className="block w-full md:w-auto rounded-md border border-gray-200 py-2 pl-3 pr-10 text-sm outline-2 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-100"
              name="quantity"
              id="quantity"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              required
            >
              {[1, 2, 3, 4, 5].map(q => (
                <option key={q} value={q}>{q}</option>
              ))}
            </select>
            <button
              className="flex h-10 items-center align-middle rounded-lg bg-blue-600 px-4 text-sm font-medium text-white shadow hover:bg-blue-700 transition-colors w-full md:w-auto"
              type="submit"
            >
              <PlusIcon className="h-5 w-5 mr-2 item-center" />
            </button>
          </form>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <span className="text-lg font-semibold text-gray-700">Total:</span>
          <span className="text-2xl font-bold text-blue-700">{formatCurrency(total)}</span>
          <button
            onClick={() => setShowPDF(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white font-semibold shadow hover:bg-blue-700 transition-colors text-sm"
            disabled={list.length === 0}
            title={list.length === 0 ? "Adicione itens para gerar o PDF" : "Gerar orçamento em PDF"}
          >
            <PrinterIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Tabela para desktop */}
      <div className="mt-6 flow-root hidden md:block">
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
            <table className="min-w-full text-gray-900">
              <thead className="bg-blue-100 text-left text-xs font-medium">
                <tr>
                  <th className="px-2 py-2">Tipo</th>
                  <th className="px-2 py-2">Quantidade</th>
                  <th className="px-2 py-2">Unidade</th>
                  <th className="px-2 py-2">Total</th>
                  <th className="px-2 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {list.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-200">
                    <td className="px-2 py-4">{item.type.title}</td>
                    <td className="px-2 py-4">{item.quantity}</td>
                    <td className="px-2 py-4">{formatCurrency(item.type.price)}</td>
                    <td className="px-2 py-4">{formatCurrency(item.total)}</td>
                    <td className="px-2 py-4">
                      <button
                        type="button"
                        className="ml-2 text-red-500 hover:underline"
                        onClick={() => onRemoveItem(idx)}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {list.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-gray-400">Nenhum item adicionado</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Cards para mobile */}
      <div className="mt-6 flex flex-col gap-3 md:hidden">
        {list.length === 0 && (
          <div className="text-center py-4 text-gray-400 bg-gray-50 rounded-lg">Nenhum item adicionado</div>
        )}
        {list.map((item, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow p-3 flex flex-col gap-1 border border-blue-100">
            <div className="flex justify-between">
              <span className="font-semibold text-blue-700">{item.type.title}</span>
              <button
                type="button"
                className="text-red-500 text-xs hover:underline"
                onClick={() => onRemoveItem(idx)}
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="flex justify-between text-xs text-gray-700">
              <span>Quantidade: <b>{item.quantity}</b></span>
              <span>Unidade: <b>{formatCurrency(item.type.price)}</b></span>
              <span>Total: <b>{formatCurrency(item.total)}</b></span>
            </div>
          </div>
        ))}
      </div>

      {/* PDF Modal/Area */}
      {showPDF && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
              onClick={() => setShowPDF(false)}
              title="Fechar"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <PdfForm list={list} clinic={clinic} user={user} />
          </div>
        </div>
      )}
    </div>
  );
}