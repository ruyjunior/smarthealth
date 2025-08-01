import Sidebar from "@/app/components/main/Sidebar";
import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>SmartHealth</title>
      </head>
      <body className="antialiased bg-gradient-to-br from-blue-700 to-blue-200 min-h-screen">
        <SessionProvider>
          <div className="flex flex-row min-h-screen">
            <Sidebar />
            <main className="flex-grow p-4 w-full ">
              {children}
            </main>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}