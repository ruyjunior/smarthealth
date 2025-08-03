import { Credit } from '@/app/query/credit/definitions';
import { CreditCard, Check, X } from 'lucide-react';

export default async function Table({ credits }: { credits: Credit[] }) {
    const todayNumber = new Date().getTime();
    const totalOfcredits = credits.length;
    const numberOfcreditsActive = credits.filter((credit) => new Date(credit.expires).getTime() > todayNumber).length;
    const numberOfcreditsUsed = credits.filter((credit) => credit.email).length;

    return (
        <section id="credit" className="w-full" >
            <div className="w-full bg-white rounded-lg shadow-md p-2">
                <h1 className="text-lg font-bold mb-0 p-2 text-gray-900">Créditos</h1>
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
        </section>
    )
}
