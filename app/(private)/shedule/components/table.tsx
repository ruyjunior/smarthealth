"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { CalendarDays } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

export default function ScheduleTable() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">Agenda</CardTitle>
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarDays className="h-5 w-5" />
            <span>{format(selectedDate, "dd/MM/yyyy")}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Aqui vai o calendário ou seletor de datas */}
          <div className="flex gap-4">
            <Button className="border border-gray-300 text-gray-700" onClick={() => setSelectedDate(new Date())}>
              Hoje
            </Button>
            {/* botão de novo agendamento */}
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Novo Agendamento
            </Button>
          </div>

          {/* Lista de horários do dia */}
          <div className="grid gap-2">
            <div className="p-4 border rounded-md shadow-sm bg-white">
              <p className="font-medium">08:00 - Maria Silva</p>
              <p className="text-sm text-muted-foreground">Consulta de fisioterapia</p>
            </div>
            <div className="p-4 border rounded-md shadow-sm bg-white">
              <p className="font-medium">09:00 - João Santos</p>
              <p className="text-sm text-muted-foreground">Avaliação inicial</p>
            </div>
            {/* ... mais horários */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
