'use client';
import {
    ChartBarIcon,
    UserGroupIcon,
    CalendarIcon,
    CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/components/ui/fonts';


const dashboardData = {
    totalPatients: 124,
    upcomingAppointments: 8,
    totalRevenue: 13240,
    activeEmployees: 4,
};

const cards = [
    {
        title: 'Pacientes Atendidos',
        value: dashboardData.totalPatients,
        icon: <UserGroupIcon className="h-6 w-6 text-blue-600" />,
    },
    {
        title: 'Próximos Atendimentos',
        value: dashboardData.upcomingAppointments,
        icon: <CalendarIcon className="h-6 w-6 text-green-600" />,
    },
];

export default function Resume() {
    return (
        <div className="p-0 mt-4">
            <h1 className={`${lusitana.className} text-2xl `}>Resumo Semanal</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-1">
                {cards.map((card, idx) => (
                    <div key={idx} className="rounded-lg border bg-white opacity-70 p-4 shadow-sm">
                        <div className="flex items-center space-x-4">
                            <div>{card.icon}</div>
                            <div>
                                <p className="text-sm text-gray-500">{card.title}</p>
                                <p className="text-xl font-semibold">{card.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
