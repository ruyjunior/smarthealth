'use client';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js';
import { lusitana } from '@/app/components/ui/fonts';
import { Service } from '@/app/domains/services/types';
import { Type } from '@/app/domains/types/types';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export default function ChartsMonth({ services, types }: { services: Service[]; types: Type[] }) {
  const pricesByType = new Map(types.map((type) => [type.id, Number(type.price)]));
  const valuesByDate = services.reduce<Map<string, number>>((totals, service) => {
    if (service.status !== 'Feito') return totals;

    const date = formatDateToLocal(service.date);
    const price = pricesByType.get(service.idtype) ?? 0;
    totals.set(date, (totals.get(date) ?? 0) + price);
    return totals;
  }, new Map());
  const dates = Array.from(valuesByDate.keys());
  const values = Array.from(valuesByDate.values());
  const total = values.reduce((acc, v) => acc + v, 0);

  const data = {
    labels: dates,
    datasets: [
      {
        label: 'Valor estimado por dia',
        data: values,
        backgroundColor: 'rgba(99, 115, 255, 0.2)',
        borderColor: 'rgb(99, 128, 255)',
        borderWidth: 2,
        borderRadius: 6,
        barPercentage: 0.7,
        categoryPercentage: 0.7,
      },
    ],
  };

  return (
    <div className="flex w-full items-center justify-between p-4">
      <div className="rounded-xl border bg-gradient-to-br from-indigo-50 to-blue-100 p-6 shadow-lg flex flex-col items-center w-full max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-2">
          <CurrencyDollarIcon className="h-8 w-8 text-indigo-500" />
          <h1
            className={`${lusitana.className} text-2xl text-blue-900 font-extrabold tracking-tight`}
          >
            Estimativa de atendimentos concluídos
          </h1>
        </div>
        <p className="mb-4 max-w-2xl text-center text-sm text-slate-600">
          Estimativa baseada nos preços atuais dos serviços concluídos neste mês. Não representa
          pagamentos recebidos.
        </p>
        <div className="mb-4 rounded-xl bg-indigo-100 px-4 py-2 text-lg font-bold text-indigo-700 shadow">
          Total estimado: {formatCurrency(total)}
        </div>
        <div className="w-full overflow-x-auto">
          <div>
            {dates.length > 0 ? (
              <Bar
                data={data}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: (context) => formatCurrency(Number(context.raw)),
                      },
                    },
                  },
                  scales: {
                    x: {
                      grid: { display: false },
                      ticks: {
                        maxRotation: 45,
                        minRotation: 30,
                        autoSkip: true,
                        maxTicksLimit: 5,
                        font: { size: 12 },
                      },
                    },
                    y: {
                      beginAtZero: true,
                      grid: { color: '#e0e7ff' },
                      ticks: {
                        font: { size: 12 },
                        callback: (value) => formatCurrency(Number(value)),
                      },
                    },
                  },
                }}
              />
            ) : (
              <p className="py-10 text-center text-sm text-slate-500">
                Nenhum atendimento concluído neste mês.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
