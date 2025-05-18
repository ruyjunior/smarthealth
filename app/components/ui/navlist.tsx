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
    <div className='flex flex-row items-left justify-center md:justify-center leading-none text-white m-5'>

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
    </div>
  );
}