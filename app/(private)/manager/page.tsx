import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Gerência',
};


export default function Page() {

  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="w-full">
        <h1>GERÊNCIA</h1>
      </div>
    </main>
  );
}