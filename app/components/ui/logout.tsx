'use client';
import { signOut as nextAuthSignOut } from 'next-auth/react';
import { PowerIcon } from '@heroicons/react/24/outline';

export default function Logout() {
  return (
    <div className="flex flex-row items-center justify-center leading-none text-white">
      <button
        type="button"
        onClick={() => nextAuthSignOut({ callbackUrl: '/' })}
        className="flex h-[48px] w-full grow items-center justify-center gap-0 rounded-xl border border-rose-400/20 bg-rose-500/15 px-2 py-3 text-sm font-medium text-rose-100 transition-all hover:bg-rose-500/25 hover:text-white md:justify-start md:px-3 md:py-2"
      >
        <PowerIcon className="w-6" />
        <div className="hidden md:block ml-5">Sair</div>
      </button>
    </div>
  );
}
