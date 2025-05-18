'use client';
import { signOut as nextAuthSignOut } from "next-auth/react";
import { PowerIcon } from '@heroicons/react/24/outline';

export default function Logout() {
    return (
        <div className='flex flex-row items-center justify-center leading-none text-white m-5'>
            <button
                type="button"
                onClick={() => nextAuthSignOut({ callbackUrl: '/' })}
                className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-red-500 py-3 px-2 text-sm font-medium hover:bg-sky-200 hover:text-blue-600 md:justify-start md:py-2 md:px-3 transition-all"
            >
                <PowerIcon className="w-6" />
                <div className="hidden md:block">Sign Out</div>
            </button>
        </div>
    );
}