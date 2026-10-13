'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Calendar,
  dateFnsLocalizer,
  type EventProps,
  type ToolbarProps,
  type View,
} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar.css';
import { format } from 'date-fns';
import { parse } from 'date-fns/parse';
import { startOfWeek } from 'date-fns/startOfWeek';
import { getDay } from 'date-fns/getDay';
import { ptBR } from 'date-fns/locale/pt-BR';
import { CalendarDaysIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { ServiceWithDetails } from '@/app/domains/services/types';
import { formatDateDb } from '@/app/lib/utils';
import StatusBadge from '@/app/components/ui/status-badge';

const locales = { 'pt-BR': ptBR };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

type AgendaEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  service: ServiceWithDetails;
};

/** DB returns 'HH:MM:SS'; formatTime() would truncate a bare 'HH:MM' to 'HH'. */
const timeLabel = (value: string | null | undefined) => (value ? value.slice(0, 5) : '');

/**
 * `service.date` is a date-only string (parsed as UTC midnight) while the date
 * picked in the calendar is local. Compare them through a local yyyy-MM-dd key
 * so a clinic at UTC-3 does not see the appointment land on the previous day.
 */
const capitalizeFirst = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

const toLocalDayKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate(),
  ).padStart(2, '0')}`;

const statusTone = (status: string) => {
  if (status === 'Feito')
    return { chip: 'border-emerald-400 bg-emerald-50 text-emerald-800', dot: 'bg-emerald-500' };
  if (status === 'Vazia')
    return { chip: 'border-slate-300 bg-slate-100 text-slate-600', dot: 'bg-slate-400' };
  return { chip: 'border-blue-400 bg-blue-50 text-blue-800', dot: 'bg-blue-500' };
};

const VIEW_OPTIONS: { value: View; label: string }[] = [
  { value: 'month', label: 'Mês' },
  { value: 'week', label: 'Semana' },
  { value: 'day', label: 'Dia' },
  { value: 'agenda', label: 'Agenda' },
];

const messages = {
  date: 'Data',
  time: 'Horário',
  event: 'Atendimento',
  allDay: 'Dia inteiro',
  week: 'Semana',
  work_week: 'Semana útil',
  day: 'Dia',
  month: 'Mês',
  previous: 'Anterior',
  next: 'Próximo',
  yesterday: 'Ontem',
  tomorrow: 'Amanhã',
  today: 'Hoje',
  agenda: 'Agenda',
  noEventsInRange: 'Nenhum atendimento neste período.',
  showMore: (total: number) => `+${total} mais`,
};

const formats = {
  dayFormat: 'dd',
  weekdayFormat: 'EEE',
  monthHeaderFormat: 'MMMM yyyy',
  dayHeaderFormat: "EEEE, d 'de' MMMM",
  timeGutterFormat: 'HH:mm',
  agendaDateFormat: 'EEE, d MMM',
  agendaTimeFormat: 'HH:mm',
  agendaHeaderFormat: ({ start, end }: { start: Date; end: Date }) =>
    `${format(start, 'd MMM yyyy', { locale: ptBR })} – ${format(end, 'd MMM yyyy', { locale: ptBR })}`,
  dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }) =>
    `${format(start, 'd MMM', { locale: ptBR })} – ${format(end, 'd MMM', { locale: ptBR })}`,
};

function CalendarToolbar({ label, view, onView, onNavigate }: ToolbarProps<AgendaEvent>) {
  const navButton =
    'inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700';

  return (
    <div className="mb-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-2">
        <button
          type="button"
          className={navButton}
          onClick={() => onNavigate('PREV')}
          aria-label="Período anterior"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          onClick={() => onNavigate('TODAY')}
        >
          Hoje
        </button>
        <button
          type="button"
          className={navButton}
          onClick={() => onNavigate('NEXT')}
          aria-label="Próximo período"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </button>
        <span className="ml-2 text-base font-bold text-slate-800 sm:text-lg">
          {capitalizeFirst(label)}
        </span>
      </div>

      <div className="inline-flex self-start rounded-2xl border border-slate-200 bg-slate-50 p-1 lg:self-auto">
        {VIEW_OPTIONS.map((option) => {
          const active = view === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onView(option.value)}
              aria-pressed={active}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition sm:text-sm ${
                active
                  ? 'bg-white text-blue-700 shadow-sm ring-1 ring-blue-100'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function EventChip({ event }: EventProps<AgendaEvent>) {
  const { service } = event;
  const tone = statusTone(service.status);

  return (
    <div
      className={`flex h-full w-full items-center gap-1.5 overflow-hidden rounded-md border-l-[3px] px-1.5 py-0.5 ${tone.chip}`}
      title={`${timeLabel(service.starttime)} ${service.client.pronoun} ${service.client.name} · ${service.type.title}`}
    >
      <span className="shrink-0 text-[10.5px] font-bold tabular-nums">
        {timeLabel(service.starttime)}
      </span>
      <span className="truncate text-[10.5px] font-medium">{service.client.name}</span>
    </div>
  );
}

export default function CalendarView({ services }: { services: ServiceWithDetails[] }) {
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [view, setView] = useState<View>('month');
  const [userPickedView, setUserPickedView] = useState(false);

  // Month/week grids are unusable on phones, so start in the agenda list there.
  useEffect(() => {
    if (!userPickedView && window.matchMedia('(max-width: 767px)').matches) {
      setView('agenda');
    }
  }, [userPickedView]);

  const events = useMemo<AgendaEvent[]>(
    () =>
      services.map((service) => {
        const day = formatDateDb(service.date);
        const start = new Date(`${day}T${service.starttime}`);
        const end = new Date(`${day}T${service.endtime}`);

        return {
          id: service.id,
          title: `${service.client.pronoun} ${service.client.name} · ${service.type.title}`,
          start,
          end: end > start ? end : new Date(start.getTime() + 30 * 60 * 1000),
          allDay: false,
          service,
        };
      }),
    [services],
  );

  const selectedServices = useMemo(
    () =>
      services
        .filter((service) => formatDateDb(service.date) === toLocalDayKey(selectedDate))
        .sort((a, b) => timeLabel(a.starttime).localeCompare(timeLabel(b.starttime))),
    [selectedDate, services],
  );

  const summary = useMemo(() => {
    const done = selectedServices.filter((s) => s.status === 'Feito').length;
    const booked = selectedServices.filter((s) => s.status === 'Marcada').length;
    const free = selectedServices.filter((s) => s.status === 'Vazia').length;
    return { done, booked, free };
  }, [selectedServices]);

  return (
    <div className="sh-agenda">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div
          className={`min-w-0 rounded-[2rem] border border-slate-200 bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:p-5 ${
            view === 'agenda' ? '' : 'h-[600px] sm:h-[680px]'
          }`}
        >
          <Calendar<AgendaEvent>
            localizer={localizer}
            culture="pt-BR"
            events={events}
            startAccessor="start"
            endAccessor="end"
            components={{ toolbar: CalendarToolbar, event: EventChip }}
            views={['month', 'week', 'day', 'agenda']}
            view={view}
            onView={(next) => {
              setUserPickedView(true);
              setView(next);
            }}
            date={selectedDate}
            onNavigate={(date) => setSelectedDate(date)}
            onSelectSlot={(slot) => slot.start && setSelectedDate(slot.start)}
            onSelectEvent={(event) => setSelectedDate(event.start)}
            selectable
            popup
            scrollToTime={new Date(1970, 0, 1, 7, 0)}
            step={30}
            timeslots={2}
            messages={messages}
            formats={formats}
            style={{ height: '100%' }}
          />
        </div>

        <aside className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <CalendarDaysIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-500">
                Dia selecionado
              </p>
              <p className="text-sm font-bold text-slate-800">
                {capitalizeFirst(
                  selectedDate.toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                  }),
                )}
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-emerald-50 py-2">
              <p className="text-lg font-extrabold text-emerald-700">{summary.done}</p>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600">
                Feitos
              </p>
            </div>
            <div className="rounded-xl bg-blue-50 py-2">
              <p className="text-lg font-extrabold text-blue-700">{summary.booked}</p>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-600">
                Marcados
              </p>
            </div>
            <div className="rounded-xl bg-slate-100 py-2">
              <p className="text-lg font-extrabold text-slate-600">{summary.free}</p>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                Vagos
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {selectedServices.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-slate-200 py-8 text-center text-sm text-slate-500">
                Nenhum atendimento neste dia.
              </p>
            ) : (
              selectedServices.map((service) => {
                const tone = statusTone(service.status);
                return (
                  <div
                    key={service.id}
                    className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2 text-sm font-bold tabular-nums text-slate-800">
                        <span className={`h-2 w-2 rounded-full ${tone.dot}`} />
                        {timeLabel(service.starttime)}
                      </span>
                      <StatusBadge status={service.status} />
                    </div>
                    <p className="mt-1.5 truncate text-sm font-semibold text-slate-700">
                      {service.client.pronoun} {service.client.name}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {service.type.title} · {service.office.title}
                    </p>
                    <p className="truncate text-xs text-slate-400">
                      {[service.user.pronoun, service.user.name].filter(Boolean).join(' ')}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
