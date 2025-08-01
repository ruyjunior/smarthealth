import { Credit } from '@/app/query/credit/definitions';
import { Update } from './buttons';
import { CreditCard, Check, X } from 'lucide-react';
import { formatCurrency } from '@/app/lib/utils';

export default async function Table({ credits }: { credits: Credit[] }) {
  const todayNumber = new Date().getTime();
  const totalOfcredits = credits.length;
  const numberOfcreditsActive = credits.filter((credit) => new Date(credit.expires).getTime() > todayNumber).length;
  const numberOfcreditsUsed = credits.filter((credit) => credit.email).length;


  const CreditComponent = () => {
    return (
      <div className="w-full bg-white rounded-lg shadow-md p-2">
        <h1 className="text-lg font-bold mb-1 p-2 text-gray-900">Créditos</h1>
        <div className="flex flex-wrap justify-center mb-2">
          <div className="w-full md:w-1/2 xl:w-1/3 p-1 flex items-center">
            <CreditCard className="w-4 h-4 mr-2 text-gray-600" />
            <h2 className="text-sm font-bold mr-2 text-gray-600">Totais:</h2>
            <p className="text-lg font-bold text-gray-900"> {totalOfcredits}</p>
          </div>
          <div className="w-full md:w-1/2 xl:w-1/3 p-1 flex items-center">
            <Check className="w-4 h-4 mr-2 text-green-500" />
            <h2 className="text-sm font-bold mb-0 text-gray-600 mr-2">Ativos:</h2>
            <p className="text-lg font-bold text-gray-900">{numberOfcreditsActive}</p>
          </div>
          <div className="w-full md:w-1/2 xl:w-1/3 p-1 flex items-center">
            <X className="w-4 h-4 mr-2 text-red-500" />
            <h2 className="text-sm font-bold mr-2 text-gray-600">Usados:</h2>
            <p className="text-lg font-bold text-gray-900">{numberOfcreditsUsed}</p>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="w-full">
      <CreditComponent />
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-lg bg-blue-200 shadow-md p-4 md:pt-0">
              {/* Mobile View */}
              <div className="md:hidden">
                {credits.map((credit) => {
                  return (
                    <div key={credit.id} className="mb-6 w-full rounded-lg bg-blue-300 p-4 shadow-sm">
                      <div className="border-b pb-4">
                        <h3 className="text-xl font-semibold text-gray-900">Expira: {(new Date(credit?.expires).toLocaleDateString('pt-BR'))}</h3>
                        <p className="text-sm text-gray-600">{credit.email ? 'Usuário: ' + credit.email : ''}</p>
                        <p className="text-sm text-gray-600">Status: {new Date(credit.expires).getTime() > todayNumber ? 'Ativo' : 'Vencido'}</p>
                        <p className="text-sm text-gray-600">Valor: {formatCurrency(Number(credit.amount))}</p>
                        <p className="text-sm text-gray-600">Compra: {(new Date(credit?.date).toLocaleDateString('pt-BR'))}</p>
                        <div className="flex justify-end gap-3 pt-3">
                          {!credit.email ? <Update id={credit.id} /> : 'Em uso'}
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop View */}
              <h1 className="text-lg font-bold m-1 p-2 text-gray-900 hidden md:block">Detalhes dos Créditos</h1>
              <table className="hidden min-w-full text-gray-900 md:table">
                <thead className="bg-green-100 text-left text-xs font-medium">
                  <tr>
                    <th className="px-2 py-2">Ativar</th>
                    <th className="px-2 py-2">Status</th>
                    <th className="px-2 py-2">Usuário</th>
                    <th className="px-2 py-2">Valor</th>
                    <th className="px-2 py-2">Compra</th>
                    <th className="px-2 py-2">Expira</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {credits.map((credit) => {
                    const status = new Date(credit.expires).getTime() > todayNumber ? 'Ativo' : 'Vencido';
                    return (
                      <tr key={credit.id} className="hover:bg-gray-300">
                        <td className="py-2 px-2 text-xs flex gap-2">
                          {!credit.email ? <Update id={credit.id} /> : 'Em uso'}
                        </td>
                        <td className="px-2 py-2 text-xs">{status}</td>
                        <td className="px-2 py-2 text-xs">{credit.email}</td>
                        <td className="px-2 py-2 text-xs">{formatCurrency(Number(credit.amount))}</td>
                        <td className="px-2 py-2 text-xs">{(new Date(credit?.date).toLocaleDateString('pt-BR'))}</td>
                        <td className="px-2 py-2 text-xs">{(new Date(credit?.expires).toLocaleDateString('pt-BR'))}</td>
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
