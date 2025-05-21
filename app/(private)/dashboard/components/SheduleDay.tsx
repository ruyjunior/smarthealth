'use client';
import {
    ChartBarIcon,
    UserGroupIcon,
    CalendarIcon,
    CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/components/ui/fonts';

const appointments = [
    { hora: '08:00', paciente: 'Maria Silva', tipo: 'Fisioterapia', profissional: 'Dr. João', consultorio: 'Sala A' },
    { hora: '09:00', paciente: 'Carlos Souza', tipo: 'Pilates', profissional: 'Dra. Ana', consultorio: 'Sala B' },
    { hora: '10:00', paciente: 'Luciana Lima', tipo: 'RPG', profissional: 'Dr. João', consultorio: 'Sala A' },
];

export default function SheduleDay() {
    return (
        <div className="p-0 mt-4">
            <h1 className={`${lusitana.className} text-2xl `}>Agendamentos do dia</h1>
            <div className="rounded-lg border bg-white opacity-70 p-4 shadow-sm">
                <ul className="space-y-2">
                    {appointments.map((a, index) => (
                        <li key={index} className="flex justify-between text-[10px] text-gray-700">
                            <span>{a.hora}</span>
                            <span>{a.paciente}</span>
                            <span>{a.tipo}</span>
                            <span>{a.profissional}</span>
                            <span>{a.consultorio}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
