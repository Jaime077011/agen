'use client';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { translations, type Translations, type Lang } from './translations';

interface LangContextType {
  lang: Lang;
  t: Translations;
  toggleLang: () => void;
  overlayOpacity: number;
}

const LangContext = createContext<LangContextType | null>(null);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');
  const [overlayOpacity, setOverlayOpacity] = useState(0);
  const [animating, setAnimating] = useState(false);

  const toggleLang = useCallback(() => {
    if (animating) return;
    setAnimating(true);
    setOverlayOpacity(1);
    setTimeout(() => {
      setLang(l => (l === 'en' ? 'ar' : 'en'));
      setOverlayOpacity(0);
      setTimeout(() => setAnimating(false), 220);
    }, 200);
  }, [animating]);

  useEffect(() => {
    const html = document.documentElement;
    if (lang === 'ar') {
      html.setAttribute('lang', 'ar');
      html.setAttribute('dir', 'rtl');
      document.body.classList.add('ar');
    } else {
      html.setAttribute('lang', 'en');
      html.setAttribute('dir', 'ltr');
      document.body.classList.remove('ar');
    }
  }, [lang]);

  return (
    <LangContext.Provider value={{ lang, t: translations[lang], toggleLang, overlayOpacity }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be inside LangProvider');
  return ctx;
}
