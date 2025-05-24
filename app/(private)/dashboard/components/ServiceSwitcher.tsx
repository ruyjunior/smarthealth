'use client'
import { useState } from "react";
import ScheduleDay from "./SheduleDay";
import { User } from '@/app/query/users/definitions';
import { Client } from '@/app/query/clients/definitions';
import { Type } from '@/app/query/types/definitions';
import { Office } from '@/app/query/offices/definitions';
import { Service } from '@/app/query/services/definitions';
import ChartsMonth from "./ChartsMonth";
import ResumeWeek from "./ResumeWeek";
import { UserGroupIcon } from '@heroicons/react/24/outline';

export default function ServiceSwitcher(
  { todayServices, weekServices, monthServices, users, clients, types, offices, user }:
    {
      todayServices: Service[], weekServices: Service[], monthServices: Service[], users: User[],
      clients: Client[], types: Type[], offices: Office[], user: User
    }) {

  const [showAll, setShowAll] = useState(false);

  const filteredToday = showAll ? todayServices : todayServices.filter(s => s.iduser === user.id);
  const filteredWeek = showAll ? weekServices : weekServices.filter(s => s.iduser === user.id);
  const filteredMonth = showAll ? monthServices : monthServices.filter(s => s.iduser === user.id);

  return (
    <div className="space-y-8">
      {user.role === 'Gerente' && (
        <div className="mb-4 flex flex-col sm:flex-row gap-2 items-start sm:items-center bg-white rounded-xl shadow px-4 py-3 border border-blue-200 max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-1 sm:mb-0">
            <UserGroupIcon className="h-6 w-6 text-blue-500" />
            <span className="font-semibold text-blue-900">Visualizar dados:</span>
          </div>
          <select
            className="border border-blue-300 rounded px-3 py-1 text-blue-900 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={showAll ? "all" : "mine"}
            onChange={e => setShowAll(e.target.value === "all")}
          >
            <option value="all">Todos da clínica</option>
            <option value="mine">Apenas meus serviços</option>
          </select>
        </div>
      )}
      <ScheduleDay
        services={filteredToday}
        users={users}
        clients={clients}
        types={types}
        offices={offices}
      />
      <ResumeWeek
        services={filteredWeek}
        users={users}
        clients={clients}
        types={types}
        offices={offices}
      />
      <ChartsMonth
        services={filteredMonth}
        users={users}
        clients={clients}
        types={types}
        offices={offices}
      />
    </div>
  );
}