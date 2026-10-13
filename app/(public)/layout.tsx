import { Metadata } from 'next';
import Footer from './site/main/footer';
import Navbar from './site/main/navbar';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';

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

/**
 * Layout of the public site. It must NOT render <html>/<head>/<body>: the root
 * layout already provides them, and a nested document breaks hydration.
 */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col">
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-ZWQVYPC32Q"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-ZWQVYPC32Q');
        `}
      </Script>

      <Navbar />
      {children}
      <Analytics />
      <Footer />
    </main>
  );
}
