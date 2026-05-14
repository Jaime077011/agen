import type { Metadata } from 'next';
import { Montserrat, Tajawal, El_Messiri } from 'next/font/google';
import { cookies } from 'next/headers';
import './globals.css';
import { LangProvider } from '@/lib/lang-context';
import { ConsentBanner } from '@/components/ConsentBanner';
import { ScrollGuard } from '@/components/ScrollGuard';
import { SoundManager } from '@/components/SoundManager';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Lang } from '@/lib/translations';

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

const VALID_LANGS = new Set(['en', 'ar-eg', 'ar-sa']);

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const raw = cookieStore.get('lang_pref')?.value ?? 'en';
  const initialLang: Lang = VALID_LANGS.has(raw) ? (raw as Lang) : 'en';

  const isAr = initialLang === 'ar-eg' || initialLang === 'ar-sa';
  const htmlLang = initialLang === 'ar-eg' ? 'ar-EG' : initialLang === 'ar-sa' ? 'ar-SA' : 'en';

  return (
    <html lang={htmlLang} dir={isAr ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <body
        className={`${montserrat.variable} ${tajawal.variable} ${elMessiri.variable}${isAr ? ' ar' : ''}`}
        suppressHydrationWarning
      >
        <LangProvider initialLang={initialLang}>
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
