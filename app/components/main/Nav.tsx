'use client';
import { Home, UserIcon, ClipboardList, CalendarDays, HeartPulse, HospitalIcon, ListCollapseIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();
  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <Home size={20} /> },
    { name: "Agenda", path: "/services", icon: <CalendarDays size={20} /> },
    { name: "Pacientes", path: "/clients", icon: <HeartPulse size={20} /> },
    { name: "Gerência", path: "/manager", icon: <ClipboardList size={20} /> },
  ];

  return (
    <nav>
      <ul>
        {menuItems.map(({ name, path, icon }) => (
          <li
            key={path}
            className={`mb-2 ${pathname === path ? "bg-gray-700" : ""} rounded-lg`}
          >
            <Link
              href={path}
              className="flex items-center p-3 hover:bg-gray-700 rounded-lg"
            >
              {icon}
              <span className="ml-3 hidden md:inline">{name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}