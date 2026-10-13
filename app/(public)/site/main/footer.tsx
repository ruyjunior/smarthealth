import Logo from '@/app/components/ui/logo';

const Footer = () => {
  return (
    <footer className="relative mt-auto bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 py-10 text-white">
      <div className="container mx-auto px-6 text-center">
        <p className="text-sm text-blue-100">
          &copy; 2025 Smart Health App. Todos os direitos reservados.
        </p>
        <div className="mt-3 flex flex-col items-center justify-center gap-2 md:flex-row md:gap-4">
          <span className="text-xs text-blue-200">
            A tecnologia que organiza melhor a sua clínica.
          </span>
        </div>
      </div>

      <div className="container mx-auto mt-4 flex flex-col items-center justify-end gap-2 px-6 text-center text-xs text-blue-100 md:flex-row md:justify-end md:text-right">
        <p>
          Developed by{' '}
          <a
            href="https://www.autoric.com.br"
            className="font-semibold underline underline-offset-2"
          >
            Autoric Automation
          </a>
        </p>
        <Logo src="/images/logos/logoDev.png" alt="Autoric Automation" size="sm" />
      </div>
    </footer>
  );
};

export default Footer;
