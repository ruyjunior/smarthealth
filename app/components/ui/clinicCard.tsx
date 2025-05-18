import { auth } from '@/app/lib/auth';
import { fetchUserById } from '@/app/query/users/data';
import { fetchClinicById } from '@/app/query/clinics/data';
import Logo from './logoClinic';

export default async function ClinicCard() {
  const session = await auth();
  if (!session || !session.user) {
    // Handle unauthenticated state, e.g., return null or a fallback UI
    return null;
  }
  const user = await fetchUserById(session.user.id);
  const clinic = await fetchClinicById(user.idclinic);
  console.log('ClinicCard', clinic.logourl);

  return (
    <div>
      <Logo w={40} h={40} dw={10} dh={10} logourl={clinic.logourl} />
      <div className='flex flex-row items-center justify-center leading-none text-white m-5'>
        <p className='font-bold items-center'> {clinic.title} </p>
      </div>
    </div>
  )
}
