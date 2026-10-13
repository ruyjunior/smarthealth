'use client';
import { useState } from 'react';
import ScheduleDay from './SheduleDay';
import { User } from '@/app/domains/users/types';
import { Client } from '@/app/domains/clients/types';
import { Type } from '@/app/domains/types/types';
import { Office } from '@/app/domains/offices/types';
import { Service } from '@/app/domains/services/types';
import ChartsMonth from './ChartsMonth';
import ResumeWeek from './ResumeWeek';
import { isManager } from '@/app/lib/roles';
import { UserGroupIcon } from '@heroicons/react/24/outline';

export default function ServiceSwitcher({
  todayServices,
  weekServices,
  monthServices,
  users,
  clients,
  types,
  offices,
  user,
}: {
  todayServices: Service[];
  weekServices: Service[];
  monthServices: Service[];
  users: User[];
  clients: Client[];
  types: Type[];
  offices: Office[];
  user: User;
}) {
  const [showAll, setShowAll] = useState(false);

  const filteredToday = showAll ? todayServices : todayServices.filter((s) => s.iduser === user.id);
  const filteredWeek = showAll ? weekServices : weekServices.filter((s) => s.iduser === user.id);
  const filteredMonth = showAll ? monthServices : monthServices.filter((s) => s.iduser === user.id);

  return (
    <div className="w-full space-y-6 px-2 py-4 md:px-4">
      <div className="mx-auto max-w-6xl rounded-[2rem] border border-blue-100 bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-900 p-5 shadow-[0_25px_80px_rgba(37,99,235,0.18)] sm:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">
              Dashboard
            </p>
            <h1 className="mt-2 text-2xl font-extrabold text-white md:text-3xl">
              Visão geral da clínica
            </h1>
          </div>

          {isManager(user.role) && (
            <div className="flex flex-col gap-2 rounded-2xl border border-white/15 bg-white/10 p-3 shadow-inner shadow-blue-900/20 backdrop-blur-sm sm:flex-row sm:items-center">
              <div className="flex items-center gap-2 text-blue-100">
                <UserGroupIcon className="h-5 w-5 text-blue-200" />
                <span className="text-sm font-semibold">Visualizar dados:</span>
              </div>
              <select
                className="rounded-xl border border-white/20 bg-slate-950/30 px-3 py-2 text-sm font-medium text-white outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-300"
                value={showAll ? 'all' : 'mine'}
                onChange={(e) => setShowAll(e.target.value === 'all')}
              >
                <option value="all" className="text-slate-800">
                  Todos da clínica
                </option>
                <option value="mine" className="text-slate-800">
                  Apenas meus serviços
                </option>
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="flex w-full items-center justify-between">
        <ScheduleDay
          services={filteredToday}
          users={users}
          clients={clients}
          types={types}
          offices={offices}
        />
      </div>
      <div className="flex w-full items-center justify-between">
        <ResumeWeek services={filteredWeek} types={types} />
      </div>
      <div className="flex w-full items-center justify-between">
        <ChartsMonth services={filteredMonth} types={types} />
      </div>
    </div>
  );
}
