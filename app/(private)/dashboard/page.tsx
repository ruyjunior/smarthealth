import Image from "next/image";

export default function Dashboard() {
  return (
    <main className="flex items-center justify-center md:h-screen">

      <div className="max-w-md mx-auto mt-1 p-1 shadow-md rounded-md">
        <h1>DASHBOARD</h1>
        <Image
          src="/images/logo.png"
          width={500}
          height={500}
          alt="Logo da Empresa"
          className="rounded-md"/>
      </div>

    </main>
  );
}