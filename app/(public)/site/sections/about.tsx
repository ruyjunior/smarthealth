import Link from "next/link";

const About = () => {
  return (
    <section
      id="about"
      className="py-20 bg-gradient-to-b from-blue-50 to-white text-center"
    >
      <h2 className="text-4xl font-extrabold mb-6 text-blue-800">
        O que esperar do Smart Health?
      </h2>
      <div className="flex justify-center flex-wrap gap-6">
        <div className="flex items-center justify-center bg-white px-6 py-8 rounded-2xl shadow-xl border border-blue-100 max-w-2xl mx-auto">
          <p className="text-gray-700 text-lg leading-relaxed">
            O <span className="font-bold text-blue-700">Smart Health</span> é a solução completa para clínicas modernas. 
            <br />
            <br />
            <span className="text-blue-700 font-semibold">Centralize sua gestão</span> com agenda inteligente, prontuário eletrônico, receitas digitais, relatórios e muito mais — tudo em um só lugar, seguro e fácil de usar.
            <br />
            <br />
            <span className="text-green-700 font-semibold">Otimize o tempo da equipe</span>, encante seus pacientes e tome decisões mais inteligentes com dados claros e acessíveis.
          </p>
        </div>
      </div>
      <div className="mt-10 flex justify-center">
        <Link
          href="/plans"
          className="inline-block px-12 py-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-2xl font-bold shadow-xl transition-all duration-200 active:scale-95"
        >
          Ver Planos e Preços
        </Link>
      </div>
      <div className="mt-8 text-gray-500 text-base">
        Experimente o Smart Health e eleve o padrão da sua clínica!
      </div>
    </section>
  );
};
export default About;