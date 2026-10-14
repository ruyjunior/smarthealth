import {
  CalendarDays,
  CircleDollarSign,
  ClipboardPenLine,
  IdCard,
  LayoutDashboard,
  MonitorSmartphone,
  ReceiptText,
  Rocket,
  Settings2,
  Ticket,
  UserCog,
  UsersRound,
  type LucideIcon,
} from 'lucide-react';
import type { HelpIconKey } from '@/app/lib/help-topics';

const ICONS: Record<HelpIconKey, LucideIcon> = {
  rocket: Rocket,
  dashboard: LayoutDashboard,
  calendar: CalendarDays,
  queue: Ticket,
  patients: UsersRound,
  notes: ClipboardPenLine,
  budget: ReceiptText,
  profile: IdCard,
  settings: Settings2,
  devices: MonitorSmartphone,
  users: UserCog,
  finance: CircleDollarSign,
};

export default function TopicIcon({ name, size = 20 }: { name: HelpIconKey; size?: number }) {
  const Icon = ICONS[name];

  return <Icon size={size} />;
}
