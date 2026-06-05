import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { QueryProvider } from '@/components/providers/query-provider';
import { Toaster } from 'sonner';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'Copa Will — Bolão Esportivo',
    template: '%s | Copa Will',
  },
  description:
    'Participe do maior bolão entre amigos. Faça seus palpites, dispute rankings e torça pelo seu time!',
  keywords: ['bolão', 'futebol', 'palpites', 'ranking', 'copa do mundo'],
  openGraph: {
    title: 'Copa Will — Bolão Esportivo',
    description: 'Faça seus palpites e dispute o ranking com seus amigos!',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.variable}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <QueryProvider>
            {children}
            <Toaster richColors position="top-right" />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
