import Link from 'next/link';
import Image from 'next/image';

const bannerAddres = '/images/hero/hero.png';

/**
 * Single-section hero: the glass card lives inside the image area, so the white
 * text always sits on the dark gradient instead of falling onto the page
 * background (which made it unreadable on tall and short viewports alike).
 */
const Hero = () => {
  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-5 py-24 sm:px-6 md:py-28">
      <Image
        src={bannerAddres}
        alt="Profissional de saúde com estetoscópio"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-sky-950/85 via-blue-900/60 to-blue-950/85" />

      <div className="relative z-10 w-full max-w-5xl rounded-[2rem] border border-white/15 bg-blue-950/35 p-6 text-center text-white shadow-2xl backdrop-blur-md md:p-10">
        <span className="mb-4 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-blue-100 md:text-sm">
          Smart Health
        </span>

        <h1 className="mb-6 text-3xl font-extrabold leading-tight text-white drop-shadow-lg sm:text-5xl md:text-6xl">
          Sua clínica online, na palma da sua mão!
        </h1>

        <p className="mx-auto max-w-3xl text-base font-medium text-blue-100 drop-shadow-sm md:text-xl">
          Gestão, atendimento e evolução dos pacientes em um só lugar, com segurança, praticidade e
          atendimento mais humano.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="#about"
            className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-lg transition-all duration-200 hover:bg-blue-700 active:scale-95 sm:w-auto md:text-lg"
          >
            Conheça o Smart Health
          </Link>
          <Link
            href="/plans"
            className="inline-flex w-full items-center justify-center rounded-xl border border-white/30 bg-white/10 px-8 py-4 text-base font-bold text-white shadow-lg transition-all duration-200 hover:bg-white/15 active:scale-95 sm:w-auto md:text-lg"
          >
            Ver planos
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
