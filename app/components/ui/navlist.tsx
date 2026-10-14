'use client';
import { User } from '@/app/domains/users/types';
import { isManager } from '@/app/lib/roles';
import {
  CalendarDays,
  ChartPieIcon,
  CircleHelp,
  ContactIcon,
  ShieldUserIcon,
  ListPlusIcon,
  ListOrderedIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Nav({ user }: { user: User }) {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <ChartPieIcon size={20} /> },
    { name: 'Orçamento', path: '/budget', icon: <ListPlusIcon size={20} /> },
    { name: 'Agenda', path: '/services', icon: <CalendarDays size={20} /> },
    { name: 'Fila', path: '/fila', icon: <ListOrderedIcon size={20} /> },
    { name: 'Pacientes', path: '/clients', icon: <ContactIcon size={20} /> },
    ...(isManager(user.role)
      ? [{ name: 'Gerência', path: '/manager', icon: <ShieldUserIcon size={20} /> }]
      : []),
    { name: 'Ajuda', path: '/help', icon: <CircleHelp size={20} /> },
  ];

  return (
    <nav className="w-full max-w-xs mx-auto mt-6">
      <ul className="flex flex-col gap-2">
        {menuItems.map(({ name, path, icon }) => {
          const active = pathname === path || pathname.startsWith(`${path}/`);
          return (
            <li key={path}>
              <Link
                href={path}
                className={`
                  group flex w-full items-center justify-center gap-3 rounded-xl border px-2 py-3 text-sm font-semibold transition md:justify-start md:px-4
                  ${
                    active
                      ? 'border-blue-400/30 bg-blue-500/20 text-white shadow-inner shadow-blue-950/20'
                      : 'border-transparent text-slate-300 hover:border-white/10 hover:bg-white/10 hover:text-white'
                  }
                `}
                aria-current={active ? 'page' : undefined}
                aria-label={name}
                title={name}
              >
                <span
                  className={`transition ${active ? 'text-blue-200' : 'text-slate-400 group-hover:text-white'}`}
                >
                  {icon}
                </span>
                <span className="ml-1 hidden truncate md:block">{name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
