import Image from 'next/image';
import Logo from '@/app/components/ui/logoDev';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-blue-100 to-blue-900 text-white py-10 text-center relative mt-auto">
      <div className="container mx-auto px-6">
        <p className="text-sm">&copy; 2025 Smart Health App. Todos os direitos reservados.</p>
        <div className="mt-1 mb-5 flex flex-col items-center justify-center gap-4 md:flex-row">
          {/*<p className="text-sm">CNPJ: 33.019.320/0001-42</p>*/}
        </div>
      </div>
      <div className="absolute bottom-2 right-6 text-xs flex items-center">
        <p>
          Developed by <a href="https://www.autoric.com.br" className="underline">Autoric Automation</a>
        </p>
        <Logo w={10} h={10} dw={10} dh={10} />
      </div>
    </footer>
  );
};
export default Footer;