'use client';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, ArcElement, PointElement, LineElement, Legend, Tooltip } from 'chart.js';
import { lusitana } from '@/app/components/ui/fonts';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ArcElement, PointElement, LineElement, Legend, Tooltip);

export default function Charts() {
  const barData = {
    labels: ['Fisioterapia', 'Pilates', 'Massagem'],
    datasets: [{
      label: 'Atendimentos',
      data: [12, 15, 10],
      backgroundColor: ['#4F46E5', '#10B981', '#F59E0B'],
    }],
  };

  // Opções para exibir legenda e controlar tamanho
  const options = {
    responsive: false, // para usar width/height fixos
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const, // ou 'right', 'top', etc.
        labels: {
          boxWidth: 20,
          font: { size: 14 },
        },
      },
      title: {
        display: false,
      },
    },
  };

  return (
    <div className="p-0 mt-4">
      <h1 className={`${lusitana.className} text-2xl`}>Gráfico por tipo</h1>
      <div className="rounded-lg border bg-white opacity-70 p-4 shadow-sm flex flex-col items-center">
        <Pie data={barData} options={options} width={280} height={280} />
      </div>
    </div>
  );
}