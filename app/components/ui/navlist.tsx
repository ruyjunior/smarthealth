'use client'
import { CalendarDays, ChartPieIcon, ContactIcon, UserCog2Icon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();
  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <ChartPieIcon size={20} /> },
    { name: "Agenda", path: "/services", icon: <CalendarDays size={20} /> },
    { name: "Pacientes", path: "/clients", icon: <ContactIcon size={20} /> },
    { name: "Gerência", path: "/manager", icon: <UserCog2Icon size={20} /> },
  ];

  return (
    <nav className="w-full max-w-xs mx-auto mt-6">
      <ul className="flex flex-col gap-2">
        {menuItems.map(({ name, path, icon }) => {
          const active = pathname === path;
          return (
            <li key={path}>
              <Link
                href={path}
                className={`
                  flex items-center gap-3 w-full px-4 py-3 rounded-lg transition
                  ${active
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                    : "bg-white text-blue-900 hover:bg-blue-50 hover:text-blue-700 border border-transparent hover:border-blue-200"}
                  font-semibold
                  text-base
                  sm:text-base
                  md:text-base
                  lg:text-base
                `}
                aria-current={active ? "page" : undefined}
              >
                <span className={`transition ${active ? "text-white" : "text-blue-500"}`}>{icon}</span>
                <span className="ml-1 truncate">{name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}