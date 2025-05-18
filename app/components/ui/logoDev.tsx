import Image from 'next/image';
import logo from '@/public/images/logos/logoDev.png';

export default function Logo({ w, h, dw, dh }: { w: number; h: number; dw?: number; dh?: number }) {
  return (
    <div className='flex flex-row items-center justify-center leading-none text-white'>
      <Image
        src={logo}
        alt="logo App"
        width={200}
        height={200}
        className={`w-${w} h-${h} md:w-${dw} md:h-${dh} m-2 rounded-md`}
      />
    </div>
  );
}