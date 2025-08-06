import Sidebar from "@/app/components/main/Sidebar";
import { SessionProvider } from "next-auth/react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="flex flex-row min-h-screen">
        <Sidebar />
        <main className="flex-grow p-4 w-full ">
          {children}
        </main>
      </div>
    </SessionProvider>
  );
}