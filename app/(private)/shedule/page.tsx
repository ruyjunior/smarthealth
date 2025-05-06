import { Metadata } from "next";
import ScheduleTable  from '@/app/(private)/shedule/components/table';

export const metadata: Metadata = {
  title: 'Agenda',
};

export default function Page() {

  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="w-full">
        <h1>AGENDA</h1>
        <ScheduleTable />
      </div>
    </main>
  );
}