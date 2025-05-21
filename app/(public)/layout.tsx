//import '@/app/ui/global.css';
import { Metadata } from 'next';
import { SessionProvider } from "next-auth/react";
import WhatsappButton from "./site/WhatsappButton";
import TopButton from "./site/TopButton";
import Footer from "./site/main/footer";
import Navbar from "./site/main/navbar";

export const metadata: Metadata = {
  title: {
    template: '%s | SH',
    default: 'SMART HEALTH',
  },
  description: 'Sua Clínica Online.',
  metadataBase: new URL('https://smarthealth-one.vercel.app/'),
  robots: {
    follow: true,
    index: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',

    title: 'SMART HEALTH',
    description: 'Sua Clínica Online.',
    url: 'https://smarthealth.app.br/',
    images: [
      {
        url: '/images/logo.png',
        width: 500,
        height: 500,
        alt: 'SMART HEALTH',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SMART HEALTH',
    description: 'Sua Clínica Online.',
    images: ['/images/logo.png'],
  },

};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 to-blue-900">
      <main className="flex-1 flex flex-col">
        <SessionProvider>
          <Navbar />
          {children}
          <Footer />
          <TopButton />
        </SessionProvider>
      </main>
    </div>
  );
}
