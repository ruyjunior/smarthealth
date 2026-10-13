import Link from 'next/link';

const About = () => {
  return (
    <section id="about" className="relative py-24 text-center">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-white to-sky-50" />

      <div className="relative mx-auto max-w-6xl px-6">
        <span className="mb-5 inline-flex items-center rounded-full border border-blue-200 bg-blue-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
          Saúde inteligente
        </span>

        <h2 className="mb-6 text-3xl font-extrabold text-blue-900 sm:text-4xl lg:text-5xl">
          O que esperar do Smart Health?
        </h2>

        <div className="mx-auto max-w-4xl rounded-[2rem] border border-blue-100 bg-white/90 p-7 shadow-[0_30px_80px_rgba(37,99,235,0.12)] backdrop-blur-sm sm:p-10">
          <p className="text-base leading-relaxed text-slate-700 sm:text-lg">
            O <span className="font-bold text-blue-700">Smart Health</span> é a solução completa
            para clínicas modernas.
            <br />
            <br />
            <span className="font-semibold text-blue-700">Centralize sua gestão</span> com agenda
            inteligente, prontuário eletrônico, receitas digitais, relatórios e muito mais — tudo em
            um só lugar, seguro e fácil de usar.
            <br />
            <br />
            <span className="font-semibold text-emerald-600">Otimize o tempo da equipe</span>,
            encante seus pacientes e tome decisões mais inteligentes com dados claros e acessíveis.
          </p>
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/plans"
            className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-blue-500/30 transition-all duration-200 hover:bg-blue-700 active:scale-95"
          >
            Ver planos e preços
          </Link>
          <Link
            href="#call"
            className="inline-flex items-center justify-center rounded-2xl border border-blue-200 bg-white px-8 py-4 text-lg font-bold text-blue-700 shadow-sm transition-all duration-200 hover:border-blue-300 hover:bg-blue-50"
          >
            Falar com especialista
          </Link>
        </div>

        <div className="mt-8 text-base text-slate-600">
          Experimente o Smart Health e eleve o padrão da sua clínica!
        </div>
      </div>
    </section>
  );
};

export default About;
