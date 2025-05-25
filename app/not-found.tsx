import logo from '@/public/images/logo.png';
import Image from 'next/image';


export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <h1 className="text-4xl font-bold text-blue-800 mb-4">Página não encontrada</h1>
            <p className="text-lg text-blue-700 mb-8">Desculpe, não conseguimos encontrar o que você procura.</p>
            <a
                href="/"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            >
                Voltar para o início
            </a>
            <Image
                src={logo.src}
                alt="logo App"
                width={400}
                height={400}
                priority={true}
                className={`w-50 h-50 md:w-50 md:h-50 m-10 rounded-md`}
            />

        </div>
    );
}