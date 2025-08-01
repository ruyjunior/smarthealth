import { Metadata } from 'next';
import { SessionProvider } from "next-auth/react";
import Footer from "./site/main/footer";
import Navbar from "./site/main/navbar";
import Script from 'next/script';
import { Analytics } from "@vercel/analytics/next";


export const metadata: Metadata = {
  title: {
    template: '%s | SH',
    default: 'SMART HEALTH',
  },
  description: 'Sua Clínica Online.',
  metadataBase: new URL('https://smarthealth.app.br/'),
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
    <html lang='pt-BR'>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ZWQVYPC32Q"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
        >
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-ZWQVYPC32Q');
          `}
        </Script>
        <script async src="https://js.stripe.com/v3/pricing-table.js"></script>

      </head>
      <body>
        <main className="flex-1 flex flex-col">
          <SessionProvider>
            <Navbar />
            {children}
            <Analytics /> {/* Vercel Analytics */}
            <Footer />
          </SessionProvider>
        </main>
      </body>
    </html>
  );
}
