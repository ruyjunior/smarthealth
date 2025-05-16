import React from 'react';
import { FcBullish, FcCalculator, FcDocument, FcOvertime } from "react-icons/fc";



const Services = () => {
  const services = [
    { title: "Agenda", desc: "Não perca nenhum atendimento.", icon: <FcOvertime size={32} /> },
    { title: "Evolução", desc: "Gerencie facilmente o acompanhamento dos seus casos.", icon: <FcBullish size={32} /> },
    { title: "Receita", desc: "Disponibilize receitas digitais profissionais.", icon: <FcDocument size={32} /> },
    { title: "Balanço", desc: "Faturamento da sua clínica de forma clara e objetiva.", icon: <FcCalculator size={32} /> }
  ];

  return (
    <section id="services"
      className="py-20 text-center">
      <h2 className="text-3xl font-bold mb-6">
        Ferramentas disponíveis
      </h2>
      <div className="flex justify-center flex-wrap gap-6">
        {services.map((service, index) => (
          <div key={index} className="flex flex-col items-center justify-center bg-gray-100 px-2 py-3 rounded-lg shadow-md">
            {service.icon}
            <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
            <p className="text-sm">{service.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
export default Services;