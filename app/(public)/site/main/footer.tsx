import Image from 'next/image';
const Footer = () => {
  return (
    <footer className="bg-blue-800 text-white py-10 text-center relative mt-auto">
      <div className="container mx-auto px-6">
        <p className="text-sm">&copy; 2025 Smart Health. All rights reserved.</p>
        <div className="mt-1 mb-5 flex flex-col items-center justify-center gap-4 md:flex-row">
          {/*<p className="text-sm">CNPJ: 33.019.320/0001-42</p>*/}
        </div>
      </div>
      <div className="absolute bottom-2 right-6 text-xs flex items-center">
        <Image
          src="/images/logos/logoDev.jpg"
          width={40}
          height={40}
          alt="Logo da Empresa"
          className="mr-2 rounded-md"
        />
        <p>
          Developed by <a href="https://www.autoric.com.br" className="underline">Autoric Automation</a>
        </p>
      </div>
    </footer>
  );
};
export default Footer;