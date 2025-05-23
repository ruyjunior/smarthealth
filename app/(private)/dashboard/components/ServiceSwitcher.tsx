'use client'
import { useState } from "react";
import ScheduleDay from "./SheduleDay";
import { User } from '@/app/query/users/definitions';
import { Client } from '@/app/query/clients/definitions';
import { Type } from '@/app/query/types/definitions';
import { Office } from '@/app/query/offices/definitions';
import { Service } from '@/app/query/services/definitions';

export default function ServiceSwitcher(
  { todayServices, users, clients, types, offices, user }:
    { todayServices: Service[], users: User[], clients: Client[], types: Type[], offices: Office[], user: User }) {

  const [showAll, setShowAll] = useState(false);
  const filtered = showAll ? todayServices : todayServices.filter(s => s.iduser === user.id);

  return (
    <div>
      {user.role === 'Gerente' &&
        <div className="mb-4 flex gap-2 items-center">
          <label className="font-medium">Visualizar:</label>
          <select
            className="border rounded px-2 py-1"
            value={showAll ? "all" : "mine"}
            onChange={e => setShowAll(e.target.value === "all")}
          >
            <option value="all">Todos da clínica</option>
            <option value="mine">Apenas meus serviços</option>
          </select>
        </div>
      }
      <ScheduleDay
        services={filtered}
        users={users}
        clients={clients}
        types={types}
        offices={offices}
      />
    </div>
  );
}