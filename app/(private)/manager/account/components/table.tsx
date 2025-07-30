import { Credit } from '@/app/query/credit/definitions';
import { formatDateBr, formatDateToLocal } from '@/app/lib/utils';

export default async function Table({ credits }: { credits: Credit[] }) {
  const numberOfcreditsActive = credits.filter((credit) => credit.expires.toString() > new Date().toISOString()).length;

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4">Creditos Ativos: {numberOfcreditsActive}</h2>
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
                        <h3 className="text-xl font-semibold text-gray-900">{(credit.date.toString())}</h3>
                        <p className="text-sm text-gray-600">Valor: {credit.amount}</p>
                        <p className="text-sm text-gray-600">Expira em: {(credit.expires.toString())}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop View */}
              <table className="hidden min-w-full text-gray-900 md:table">
                <thead className="bg-green-100 text-left text-xs font-medium">
                  <tr>
                    <th className="px-2 py-2">Status</th>
                    <th className="px-2 py-2">Email</th>
                    <th className="px-2 py-2">Valor</th>
                    <th className="px-2 py-2">Compra</th>
                    <th className="px-2 py-2">Expira</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {credits.map((credit) => {
                    return (
                      <tr key={credit.id} className="hover:bg-gray-300">
                        <td className="px-2 py-2 text-xs">
                          {credit.expires.toString() > new Date().toDateString() ? 'Vencido' : 'Ativo'}
                        </td>
                        <td className="px-2 py-2 text-xs">{credit.email}</td>                        
                        <td className="px-2 py-2 text-xs">{credit.amount}</td>
                        <td className="px-2 py-2 text-xs">{credit.date.toString()}</td>
                        <td className="px-2 py-2 text-xs">{(credit.expires.toString())}</td>
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
