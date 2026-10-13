import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './styles/globals.css';
import AuthSessionProvider from '@/app/components/providers/session-provider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    template: '%s | SH',
    default: 'Smart Health',
  },
  description: 'your virtual clinic app',
  //metadataBase: new URL('https://www.autoric.com.br'),
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
  },
  robots: {
    follow: true,
    index: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

/**
 * Sole owner of the <html>/<head>/<body> document shell. Nested layouts render
 * their content inside this body, never their own document tags.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  );
}
