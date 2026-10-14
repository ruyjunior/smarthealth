import { Metadata } from 'next';
import {
  UserIcon,
  HospitalIcon,
  HeartHandshakeIcon,
  FolderHeartIcon,
  ClipboardPenLine,
  CircleDollarSign,
  HandCoinsIcon,
  AtSignIcon,
  MonitorSmartphoneIcon,
} from 'lucide-react';
import Link from 'next/link';
import ListPageShell from '@/app/components/ui/list-page-shell';

export const metadata: Metadata = {
  title: 'Gerência',
};

export default async function Page() {
  const menuItems = [
    {
      name: 'Clínica',
      path: '/manager/clinics',
      icon: <HospitalIcon size={20} />,
      desc: 'Dados cadastrais da clínica',
    },
    {
      name: 'Produtos',
      path: '/manager/types',
      icon: <FolderHeartIcon size={20} />,
      desc: 'Especialidades e valores',
    },
    {
      name: 'Consultórios',
      path: '/manager/offices',
      icon: <HeartHandshakeIcon size={20} />,
      desc: 'Salas de atendimento',
    },
    {
      name: 'Fichas',
      path: '/manager/notetypes',
      icon: <ClipboardPenLine size={20} />,
      desc: 'Modelos de ficha clínica',
    },
    {
      name: 'Atendimento',
      path: '/manager/devices',
      icon: <MonitorSmartphoneIcon size={20} />,
      desc: 'Totem e telão da recepção',
    },
    {
      name: 'Usuários',
      path: '/manager/users',
      icon: <UserIcon size={20} />,
      desc: 'Profissionais e acessos',
    },
    {
      name: 'Pagamentos',
      path: '/manager/payments',
      icon: <CircleDollarSign size={20} />,
      desc: 'Lançamentos financeiros',
    },
    {
      name: 'Ganhos',
      path: '/manager/gains',
      icon: <HandCoinsIcon size={20} />,
      desc: 'Estimativa por atendimento',
    },
    {
      name: 'Conta',
      path: '/manager/account',
      icon: <AtSignIcon size={20} />,
      desc: 'Plano e créditos',
    },
  ];

  return (
    <ListPageShell
      eyebrow="Gerência"
      title="Configurações da clínica"
      subtitle="Gerencie especialidades, consultórios, fichas, usuários e informações financeiras."
    >
      <div className="mx-auto mt-6 grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {menuItems.map(({ name, path, icon, desc }) => (
          <Link
            key={path}
            href={path}
            className="group flex flex-col gap-3 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(148,163,184,0.12)] transition-all duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_25px_70px_rgba(37,99,235,0.12)]"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-100">
              {icon}
            </span>
            <span className="text-base font-bold text-slate-800">{name}</span>
            <span className="text-sm leading-relaxed text-slate-500">{desc}</span>
          </Link>
        ))}
      </div>
    </ListPageShell>
  );
}
