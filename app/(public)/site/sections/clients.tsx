import Image from 'next/image';

const logos = [
  '/images/clients/ambev.jpg',
  '/images/clients/assaabloy.png',
  '/images/clients/gestamp.jpg',
  '/images/clients/gm.jpg',
  '/images/clients/zegla.jpg',
];

const Clients = () => {
  return (
    <section id="clients" className="relative py-24 text-center">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-sky-50 to-white" />

      <div className="relative mx-auto max-w-6xl px-6">
        <span className="mb-5 inline-flex items-center rounded-full border border-sky-200 bg-sky-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-sky-700">
          Confiança
        </span>

        <h2 className="mb-12 text-3xl font-extrabold text-blue-900 sm:text-4xl lg:text-5xl">
          Clientes que já usam nossas ferramentas
        </h2>

        <div className="flex flex-wrap items-center justify-center gap-6">
          {logos.map((logo, index) => (
            <div
              key={index}
              className="flex h-24 w-32 items-center justify-center rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-[0_15px_35px_rgba(148,163,184,0.12)] backdrop-blur-sm"
            >
              <Image
                src={logo}
                width={100}
                height={100}
                alt="Cliente do Smart Health"
                className="h-auto max-h-12 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Clients;
