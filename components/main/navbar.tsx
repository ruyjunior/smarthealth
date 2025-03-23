import Link from 'next/link';
import Image from 'next/image';
import { FaBars, FaTimes, FaPowerOff } from 'react-icons/fa';
import { signOut } from '@/utils/auth';

const Navbar = () => {
  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 bg-transparent'}`}>
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link href={"/"}>
          <Image
            src="/images/logo.png"
            width={120}
            height={120}
            alt="Logo da Empresa"
            className="rounded-md"
          />

        </Link>

        {/* Menu Desktop */}
        <div className="hidden md:flex space-x-6 text-white text-lg font-semibold">
          <Link href="/login">Login</Link>
          <form
            action={async () => {
              'use server';
              await signOut({ redirectTo: '/' });
            }}
          >
            <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-500 p-3 text-sm font-medium hover:bg-blue-200 hover:text-blue-500 md:flex-none md:justify-start md:p-2 md:px-3">
              <FaPowerOff className="w-6" />
              <div className="hidden md:block">Sign Out</div>
            </button>
          </form>
        </div>
        </div>
    </nav>
  );
};

export default Navbar;