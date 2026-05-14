import type { Metadata } from 'next';
import { Montserrat, Tajawal, El_Messiri } from 'next/font/google';
import './globals.css';
import { LangProvider } from '@/lib/lang-context';
import { ConsentBanner } from '@/components/ConsentBanner';
import { ScrollGuard } from '@/components/ScrollGuard';
import { SoundManager } from '@/components/SoundManager';
import { SpeedInsights } from '@vercel/speed-insights/next';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '900'],
  variable: '--font-montserrat',
  display: 'swap',
});

const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '700', '800', '900'],
  variable: '--font-tajawal',
  display: 'swap',
});

const elMessiri = El_Messiri({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-el-messiri',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'The Archetypers',
  description: 'Strategy, design, and growth — built as one system.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <body className={`${montserrat.variable} ${tajawal.variable} ${elMessiri.variable}`} suppressHydrationWarning>
        <LangProvider>
          {children}
        </LangProvider>
        <ConsentBanner />
        <ScrollGuard />
        <SoundManager />
        <SpeedInsights />
      </body>
    </html>
  );
}
