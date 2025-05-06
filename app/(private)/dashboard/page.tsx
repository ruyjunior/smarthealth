import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default function Page() {

  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="w-full">
        <h1>DASHBOARD</h1>
      </div>
    </main>
  );
}