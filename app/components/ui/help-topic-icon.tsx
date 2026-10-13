import {
  CalendarDays,
  CircleDollarSign,
  ClipboardPenLine,
  IdCard,
  LayoutDashboard,
  ReceiptText,
  Rocket,
  Settings2,
  UserCog,
  UsersRound,
  type LucideIcon,
} from 'lucide-react';
import type { HelpIconKey } from '@/app/lib/help-topics';

const ICONS: Record<HelpIconKey, LucideIcon> = {
  rocket: Rocket,
  dashboard: LayoutDashboard,
  calendar: CalendarDays,
  patients: UsersRound,
  notes: ClipboardPenLine,
  budget: ReceiptText,
  profile: IdCard,
  settings: Settings2,
  users: UserCog,
  finance: CircleDollarSign,
};

export default function TopicIcon({ name, size = 20 }: { name: HelpIconKey; size?: number }) {
  const Icon = ICONS[name];

  return <Icon size={size} />;
}
