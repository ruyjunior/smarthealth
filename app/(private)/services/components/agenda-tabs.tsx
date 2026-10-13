'use client';

import { useState } from 'react';
import { CalendarDaysIcon, TableCellsIcon } from '@heroicons/react/24/outline';

const TABS = [
  { value: 'list', label: 'Lista', icon: TableCellsIcon },
  { value: 'calendar', label: 'Calendário', icon: CalendarDaysIcon },
] as const;

export default function AgendaTabs({
  list,
  calendar,
}: {
  list: React.ReactNode;
  calendar: React.ReactNode;
}) {
  const [active, setActive] = useState<'list' | 'calendar'>('list');

  return (
    <div className="w-full">
      <div className="mx-auto flex max-w-7xl justify-center pb-4">
        <div className="inline-flex rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
          {TABS.map(({ value, label, icon: Icon }) => {
            const isActive = active === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setActive(value)}
                aria-pressed={isActive}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className={active === 'list' ? 'block' : 'hidden'}>{list}</div>
      <div className={active === 'calendar' ? 'block' : 'hidden'}>{calendar}</div>
    </div>
  );
}
