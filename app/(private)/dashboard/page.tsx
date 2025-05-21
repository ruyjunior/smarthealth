import { Metadata } from "next";
import Resume from "./components/Resume";
import ScheduleDay from "./components/SheduleDay";
import Charts from "./components/ChartsWeek";

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default function Page() {

  return (
    <div className="w-full">
      <div className="w-full">
        <ScheduleDay />          
        <Resume />
        <Charts />
      </div>
    </div>
  );
}