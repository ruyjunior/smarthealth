import Image from "next/image";
const bannerAddres = '/images/hero/hero.png';

const Hero = () => {
  return (
    <>
      <section className="relative h-[40vh] md:h-[80vh]">
        <Image
          src={bannerAddres}
          alt="Background"
          width={1600}
          height={900}
          className="absolute inset-0 w-full h-full object-cover opacity-90"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 via-blue-800/40 to-transparent" />
      </section>

      <section className="relative flex flex-col items-center justify-center text-white text-center pt-30 px-6 md:pt-50 mb-0 md:mb-16 -mt-24 md:-mt-40">
        <div className="relative z-10 max-w-4xl px-4">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold leading-tight drop-shadow-lg mb-6">
            Sua clínica online, na palma da sua mão!
          </h1>
          <p className="text-lg md:text-2xl font-medium text-blue-100 mb-8 drop-shadow">
            Gestão, atendimento e evolução dos pacientes em um só lugar, com segurança e praticidade.
          </p>
          <a
            href="#about"
            className="inline-block px-10 py-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold shadow-lg transition-all duration-200 active:scale-95"
          >
            Conheça o Smart Health
          </a>
        </div>
      </section>
    </>
  );
};

export default Hero;