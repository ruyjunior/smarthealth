'use client';

import { useState, useMemo } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format } from 'date-fns';
import { parse } from 'date-fns/parse';
import { startOfWeek} from 'date-fns/startOfWeek';
import { getDay } from 'date-fns/getDay';
import { ptBR } from 'date-fns/locale/pt-BR';
import { ServiceWithDetails } from '@/app/query/services/definitions'; 
import { formatTime } from '@/app/lib/utils';

const locales = {
  'pt-BR': ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

export default function CalendarView({ services }: { services: ServiceWithDetails[] }) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const events = useMemo(() => {
    return services.map(service => ({
      id: service.id,
      title: `${service.type.title} -  ${service.client.pronoun} ${service.client.name}`,
      start: new Date(`${service.date}T${service.starttime}`),
      end: new Date(`${service.date}T${service.endtime}`),
      resource: service,
    }));
  }, [services]);

  const selectedServices = useMemo(() => {
    if (!selectedDate) return [];
    return services.filter(
      (s) => new Date(s.date).toDateString() === selectedDate.toDateString()
    );
  }, [selectedDate, services]);

  return (
    <div className="flex w-full h-full">
      {/* Calendário */}
      <div className="flex-1">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '80vh' }}
          onSelectSlot={(slot) => {
            if (slot.start) setSelectedDate(slot.start);
          }}
          selectable
          onSelectEvent={(event) => setSelectedDate(new Date(event.start))}
          messages={{
            next: "Próximo",
            previous: "Anterior",
            today: "Hoje",
            month: "Mês",
            week: "Semana",
            day: "Dia",
            agenda: "Agenda",
          }}
        />
      </div>

      {/* Painel Lateral */}
      {selectedDate && (
        <div className="w-[350px] bg-white shadow-lg p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-2">
            Atendimentos em {selectedDate.toLocaleDateString()}
          </h2>
          {selectedServices.length === 0 ? (
            <p>Nenhum atendimento.</p>
          ) : (
            selectedServices.map(service => (
              <div key={service.id} className="mb-4 border-b pb-2">
                <p className="text-sm font-bold">{service.client.pronoun} {service.client.name}</p>
                <p className="text-sm">Tipo: {service.type.title}</p>
                <p className="text-sm">Horário: {formatTime(service.starttime)} - {formatTime(service.endtime)}</p>
                <p className="text-sm">Consultório: {service.office.title}</p>
                <p className="text-sm">Profissional: {service.user.name}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
