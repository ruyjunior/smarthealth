const About = () => {
  return (
    <section id="about"
      className="py-20 text-center">
      <h2 className="text-3xl font-bold mb-6">
        O que esperar do Smart Health?
      </h2>
      <div className="flex justify-center flex-wrap gap-6">
        <div className="flex items-center justify-center bg-gray-100 px-2 py-3 rounded-lg shadow-md">
          <p className="max-w-3xl mx-auto text-gray-600 leading-relaxed">
            Smart Health é um aplicativo que auxilia a administração dos serviços da sua clínica.
            Ferramentas como Agenda, Receita digital, Gráficos de evolução, entre outros, 
            estão disponíveis para que seus clientes sejam sempre bem assistidos.
          </p>
        </div>
      </div>
    </section>
  );
};
export default About;