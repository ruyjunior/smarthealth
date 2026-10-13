import React from 'react';
import { FcBullish, FcCalculator, FcDocument, FcOvertime } from 'react-icons/fc';

const Services = () => {
  const services = [
    {
      title: 'Agenda Inteligente',
      desc: 'Organize atendimentos com clareza, evite conflitos de horários e entregue mais pontualidade ao paciente.',
      icon: <FcOvertime size={40} />,
    },
    {
      title: 'Evolução Clínica',
      desc: 'Acompanhe o progresso de cada paciente com históricos, registros e indicadores em um só lugar.',
      icon: <FcBullish size={40} />,
    },
    {
      title: 'Receita Digital',
      desc: 'Emita receitas seguras e profissionais, com rapidez e muito menos burocracia para a sua equipe.',
      icon: <FcDocument size={40} />,
    },
    {
      title: 'Balanço Financeiro',
      desc: 'Monitore faturamento, fluxo e desempenho da clínica com relatórios prontos para decisão.',
      icon: <FcCalculator size={40} />,
    },
  ];

  return (
    <section id="services" className="relative py-24 text-center">
      <div className="absolute inset-0 bg-gradient-to-b from-sky-50 via-white to-blue-50" />

      <div className="relative mx-auto max-w-7xl px-6">
        <span className="mb-5 inline-flex items-center rounded-full border border-sky-200 bg-sky-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-sky-700">
          Soluções completas
        </span>

        <h2 className="mb-5 text-3xl font-extrabold text-blue-900 sm:text-4xl lg:text-5xl">
          Tudo o que sua clínica precisa em um só lugar
        </h2>

        <p className="mx-auto mb-12 max-w-3xl text-base text-slate-600 sm:text-lg">
          O Smart Health oferece ferramentas completas para transformar a gestão da sua clínica,
          otimizar o tempo da equipe e encantar seus pacientes.
        </p>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {services.map((service, index) => (
            <div
              key={index}
              className="group flex min-h-[260px] flex-col items-center rounded-[1.75rem] border border-blue-100 bg-white p-8 text-center shadow-[0_18px_50px_rgba(30,64,175,0.08)] transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-[0_25px_70px_rgba(30,64,175,0.14)]"
            >
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 shadow-inner shadow-blue-100">
                {service.icon}
              </div>
              <h3 className="mb-3 text-xl font-bold text-blue-800">{service.title}</h3>
              <p className="text-base leading-relaxed text-slate-600">{service.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <span className="inline-flex items-center rounded-full bg-blue-100 px-6 py-3 text-base font-semibold text-blue-800 shadow-sm ring-1 ring-blue-200">
            Experimente o Smart Health e eleve o padrão da sua clínica!
          </span>
        </div>
      </div>
    </section>
  );
};

export default Services;
