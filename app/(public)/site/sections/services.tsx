import React from 'react';
import { FcBullish, FcCalculator, FcDocument, FcOvertime } from "react-icons/fc";

const Services = () => {
  const services = [
    {
      title: "Agenda Inteligente",
      desc: "Organize seus atendimentos com facilidade, evite conflitos de horários e ofereça mais pontualidade para seus pacientes.",
      icon: <FcOvertime size={40} />,
    },
    {
      title: "Evolução Clínica",
      desc: "Acompanhe o progresso de cada paciente com gráficos, anotações e histórico detalhado, tudo em um só lugar.",
      icon: <FcBullish size={40} />,
    },
    {
      title: "Receita Digital",
      desc: "Emita receitas digitais profissionais, seguras e prontas para serem enviadas por e-mail ou impressas.",
      icon: <FcDocument size={40} />,
    },
    {
      title: "Balanço Financeiro",
      desc: "Visualize o faturamento da sua clínica de forma clara, com relatórios e indicadores para decisões mais inteligentes.",
      icon: <FcCalculator size={40} />,
    }
  ];

  return (
    <section id="services" className="py-20 bg-gradient-to-b from-blue-50 to-white text-center">
      <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 text-blue-800">
        Tudo o que sua clínica precisa em um só lugar
      </h2>
      <p className="max-w-2xl mx-auto text-gray-600 mb-12 text-lg">
        O Smart Health oferece ferramentas completas para transformar a gestão da sua clínica, otimizar o tempo da equipe e encantar seus pacientes.
      </p>
      <div className="flex flex-wrap justify-center gap-8">
        {services.map((service, index) => (
          <div
            key={index}
            className="flex flex-col items-center bg-white px-8 py-8 rounded-2xl shadow-lg border border-blue-100 max-w-xs transition-transform hover:-translate-y-2 hover:shadow-2xl"
          >
            <div className="mb-4">{service.icon}</div>
            <h3 className="text-xl font-bold mb-2 text-blue-700">{service.title}</h3>
            <p className="text-gray-600 text-base">{service.desc}</p>
          </div>
        ))}
      </div>
      <div className="mt-12">
        <span className="inline-block bg-blue-100 text-blue-700 px-6 py-3 rounded-full font-semibold text-lg shadow-sm">
          Experimente o Smart Health e eleve o padrão da sua clínica!
        </span>
      </div>
    </section>
  );
};
export default Services;