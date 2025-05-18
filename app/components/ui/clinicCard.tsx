import { auth } from '@/app/lib/auth';
import { fetchUserById } from '@/app/query/users/data';
import { fetchClinicById } from '@/app/query/clinics/data';
import Logo from './logoClinic';

export default async function ClinicCard() {
  const session = await auth();
  if (!session || !session.user) {
    return null;
  }
  const user = await fetchUserById(session.user.id);
  const clinic = await fetchClinicById(user.idclinic);

  return (
    <div className="flex flex-col items-center justify-center">
      <Logo w={40} h={40} dw={10} dh={10} logourl={clinic.logourl} />
      <div className="mt-4 text-center">
        <p
          className="
            font-bold
            text-base
            md:text-lg
            text-white
            tracking-tight
            leading-snug
            px-2
            md:px-0
            whitespace-normal
            break-words
            shadow-sm
            "
        >
          {clinic.title}
        </p>
      </div>
    </div>
  );
}