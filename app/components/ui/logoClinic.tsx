import Image from 'next/image';
import logo from '@/public/images/logo.png';


export default async function Logo({ w, h, dw, dh, logourl }: { w: number; h: number; dw?: number; dh?: number; logourl: string }) {
  return (
    <div className='flex flex-row items-center justify-center leading-none text-white'>
      <Image
        src={logourl ? logourl : logo.src}
        alt="logo App"
        width={200}
        height={200}
        priority={true}
        className={`w-${w} h-${h} md:w-${dw} md:h-${dh} mr-0 rounded-md`}
      />
    </div>
  );
}