'use client';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, ArcElement, PointElement, LineElement, Legend, Tooltip } from 'chart.js';
import { lusitana } from '@/app/components/ui/fonts';
import { Service } from '@/app/query/services/definitions';
import { User } from '@/app/query/users/definitions';
import { Client } from '@/app/query/clients/definitions';
import { Type } from '@/app/query/types/definitions';
import { Office } from '@/app/query/offices/definitions';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ArcElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip
);

export default function ChartsMonth(
  { services, users, clients, types, offices }:
    { services: Service[], users: User[], clients: Client[], types: Type[], offices: Office[] }
) {

  const dates = Array.from(
    new Set(
      services
        .filter(service => service.status === 'Feito')
        .map(service => formatDateToLocal(service.date))
    )
  );
  const values = dates.map(date => {
    const servicesForDate = services.filter(
      service => formatDateToLocal(service.date) === date && service.status === 'Feito'
    );
    const totalValue = servicesForDate.reduce((acc, service) => {
      const type = types.find(t => t.id === service.idtype);
      const price = type?.price ? Number(type.price) : 0;
      return acc + price;
    }, 0);
    return totalValue;
  });
  const total = values.reduce((acc, v) => acc + v, 0);

  const data = {
    labels: dates,
    datasets: [{
      label: 'Valores por dia',
      data: values,
      backgroundColor: 'rgba(99, 115, 255, 0.2)',
      borderColor: 'rgb(99, 128, 255)',
      borderWidth: 2,
      borderRadius: 6,
      barPercentage: 0.7,
      categoryPercentage: 0.7,
    }]
  };

  return (
    <div className="flex w-full items-center justify-between p-4">
      <div className="rounded-xl border bg-gradient-to-br from-indigo-50 to-blue-100 p-6 shadow-lg flex flex-col items-center w-full max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-2">
          <CurrencyDollarIcon className="h-8 w-8 text-indigo-500" />
          <h1 className={`${lusitana.className} text-2xl text-blue-900 font-extrabold tracking-tight`}>
            Faturamento Mensal
          </h1>
        </div>
        <div className="mb-4 text-lg font-bold text-indigo-700 bg-indigo-100 rounded px-4 py-2 shadow">
          Total acumulado: {formatCurrency(total)}
        </div>
        <div className="w-full overflow-x-auto">
          <div >
            <Bar
              data={data}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                  title: { display: false }
                },
                scales: {
                  x: {
                    grid: { display: false },
                    ticks: {
                      maxRotation: 45,
                      minRotation: 30,
                      autoSkip: true,
                      maxTicksLimit: 5,
                      font: { size: 12 }
                    }
                  },
                  y: {
                    grid: { color: '#e0e7ff' },
                    ticks: {
                      font: { size: 12 }
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}