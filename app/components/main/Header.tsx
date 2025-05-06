import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

export default function Header() {
  return (
    <header className="w-full shadow md:ml-64  ml-20 px-6 py-4 border-b border-gray-200 sticky top-0 z-40">
      <h1 className="text-xl font-semibold">Dashboard</h1>
    </header>
  );
}
