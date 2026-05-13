import type { Metadata } from 'next';
import { Montserrat, Cairo } from 'next/font/google';
import './globals.css';
import { LangProvider } from '@/lib/lang-context';
import { ConsentBanner } from '@/components/ConsentBanner';
import { ScrollGuard } from '@/components/ScrollGuard';
import { SoundManager } from '@/components/SoundManager';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '900'],
  variable: '--font-montserrat',
  display: 'swap',
});

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700', '900'],
  variable: '--font-cairo',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'The Archetypers',
  description: 'Strategy, design, and growth — built as one system.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <body className={`${montserrat.variable} ${cairo.variable}`} suppressHydrationWarning>
        <LangProvider>
          {children}
        </LangProvider>
        <ConsentBanner />
        <ScrollGuard />
        <SoundManager />
      </body>
    </html>
  );
}
