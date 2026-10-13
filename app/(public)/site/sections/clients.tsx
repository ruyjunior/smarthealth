import SafeImage from '@/app/components/ui/safe-image';
import { fetchPublicClinicLogos } from '@/app/domains/clinics/queries';

/**
 * Vitrine de clientes: mostra a logo das clínicas que já cadastraram uma.
 * Só entram as que têm logo, e o nome da clínica é usado como alt e como
 * fallback caso a imagem falhe.
 */
const Clients = async () => {
  const clinics = await fetchPublicClinicLogos();

  if (clinics.length === 0) {
    return null;
  }

  return (
    <section id="clients" className="relative py-24 text-center">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-sky-50 to-white" />

      <div className="relative mx-auto max-w-6xl px-6">
        <span className="mb-5 inline-flex items-center rounded-full border border-sky-200 bg-sky-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-sky-700">
          Confiança
        </span>

        <h2 className="mb-12 text-3xl font-extrabold text-blue-900 sm:text-4xl lg:text-5xl">
          Clínicas que já usam nossas ferramentas
        </h2>

        <div className="flex flex-wrap items-center justify-center gap-6">
          {clinics.map((clinic) => (
            <div
              key={clinic.id}
              className="flex h-24 w-32 items-center justify-center rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-[0_15px_35px_rgba(148,163,184,0.12)] backdrop-blur-sm"
            >
              <SafeImage
                src={clinic.logourl}
                width={100}
                height={100}
                alt={`Logo de ${clinic.title}`}
                className="h-auto max-h-12 w-auto object-contain"
                fallback={
                  <span className="text-sm font-bold leading-tight text-slate-500">
                    {clinic.title}
                  </span>
                }
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Clients;
