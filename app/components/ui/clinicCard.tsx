import { auth } from '@/app/lib/auth';
import { getSessionUser } from '@/app/lib/session';
import { fetchClinicById } from '@/app/domains/clinics/queries';
import Logo from './logo';

export default async function ClinicCard() {
  const session = await auth();
  if (!session || !session.user) {
    return null;
  }

  const userId = session.user.id;
  if (!userId) {
    return null;
  }

  const user = await getSessionUser();

  if (!user) {
    return null;
  }
  const clinic = await fetchClinicById(user.idclinic);
  const now = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-2 text-center md:p-3">
      <Logo src={clinic.logourl} alt={clinic.title ?? 'Clínica'} size="md" priority />
      <div className="mt-2 hidden md:block">
        <p className="text-sm font-semibold text-white">{clinic.title}</p>
        <p className="mt-1 text-xs text-slate-400">{now}</p>
      </div>
    </div>
  );
}
