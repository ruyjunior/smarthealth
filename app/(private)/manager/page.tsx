import { Metadata } from 'next';
import { lusitana } from '@/app/components/ui/fonts';
import {
  UserIcon, HospitalIcon, HeartHandshakeIcon, FolderHeartIcon,
  ClipboardPenLine, CircleDollarSign, HandCoinsIcon, AtSignIcon
} from "lucide-react";
import Link from "next/link";


export const metadata: Metadata = {
  title: 'Gerência',
};

export default async function Page() {
  const menuItems = [
    { name: "Clínica", path: '/manager/clinics', icon: <HospitalIcon size={20} /> },
    { name: "Produtos", path: "/manager/types", icon: <FolderHeartIcon size={20} /> },
    { name: "Consultórios", path: "/manager/offices", icon: <HeartHandshakeIcon size={20} /> },
    { name: "Fichas", path: "/manager/notetypes", icon: <ClipboardPenLine size={20} /> },
    { name: "Usuários", path: '/manager/users', icon: <UserIcon size={20} /> },
    { name: "Pagamentos", path: '/manager/payments', icon: <CircleDollarSign size={20} /> },
    { name: "Ganhos", path: '/manager/gains', icon: <HandCoinsIcon size={20} /> },
    { name: "Conta", path: '/manager/account', icon: <AtSignIcon size={20} /> },
  ];


  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Gerência</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <nav>
          <ul>
            {menuItems.map(({ name, path, icon }) => (
              <li
                key={path}
                className={`mb-2 rounded-lg`}
              >
                <Link
                  href={path}
                  className="flex items-center p-3 hover:bg-gray-700 rounded-lg"
                >
                  {icon}
                  <span className="ml-3 md:inline">{name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

      </div>
    </div>
  );
}