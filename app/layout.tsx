import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'SIA Site Criative - Portfólio de Serviços',
  description: 'Transformamos ideias em experiências digitais extraordinárias. Design, desenvolvimento e marketing que impulsionam seu negócio.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-br" className={`${inter.variable}`}>
      <body suppressHydrationWarning className="bg-dark text-text-primary font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
