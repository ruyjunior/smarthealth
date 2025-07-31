import { Credit } from '@/app/query/credit/definitions';
import { Update } from './buttons';
export default async function Table({ credits }: { credits: Credit[] }) {
  const todayNumber = new Date().getTime();
  const totalOfcredits = credits.length;
  const numberOfcreditsActive = credits.filter((credit) => new Date(credit.expires).getTime() > todayNumber).length;
  const numberOfcreditsUsed = credits.filter((credit) => credit.email).length;

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-0">Créditos </h1>
      <h2 className="text-2sm font-bold mb-0">Totais: {totalOfcredits}</h2>
      <h2 className="text-2sm font-bold mb-0">Ativos: {numberOfcreditsActive}</h2>
      <h2 className="text-2sm font-bold mb-0">Usados: {numberOfcreditsUsed}</h2>
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
                        <p className="text-sm text-gray-600">Valor: {credit.amount}</p>
                        <p className="text-sm text-gray-600">Compra: {(new Date(credit?.date).toLocaleDateString('pt-BR'))}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop View */}
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
                        <td className="py-2 px-2 flex gap-2 items-center justify-center">
                          {!credit.email ? <Update id={credit.id} /> : 'Em uso'}
                        </td>
                        <td className="px-2 py-2 text-xs">{status}</td>
                        <td className="px-2 py-2 text-xs">{credit.email}</td>
                        <td className="px-2 py-2 text-xs">{credit.amount}</td>
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
