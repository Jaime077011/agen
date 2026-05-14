'use client';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { translations, type Translations, type Lang } from './translations';

interface LangContextType {
  lang: Lang;
  t: Translations;
  toggleLang: () => void;
  overlayOpacity: number;
}

const CYCLE: Lang[] = ['en', 'ar-eg', 'ar-sa'];
const LANG_COOKIE = 'lang_pref';

function saveLangCookie(lang: Lang) {
  document.cookie = `${LANG_COOKIE}=${lang}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
}

const LangContext = createContext<LangContextType | null>(null);

export function LangProvider({ children, initialLang = 'en' }: { children: React.ReactNode; initialLang?: Lang }) {
  const [lang, setLang] = useState<Lang>(initialLang);
  const [overlayOpacity, setOverlayOpacity] = useState(0);
  const [animating, setAnimating] = useState(false);

  const toggleLang = useCallback(() => {
    if (animating) return;
    setAnimating(true);
    setOverlayOpacity(1);
    setTimeout(() => {
      setLang(l => {
        const next = CYCLE[(CYCLE.indexOf(l) + 1) % CYCLE.length];
        saveLangCookie(next);
        return next;
      });
      setOverlayOpacity(0);
      setTimeout(() => setAnimating(false), 220);
    }, 200);
  }, [animating]);

  // Sync html/body attributes when lang changes (covers user toggles)
  useEffect(() => {
    const html = document.documentElement;
    if (lang === 'ar-eg' || lang === 'ar-sa') {
      html.setAttribute('lang', lang === 'ar-eg' ? 'ar-EG' : 'ar-SA');
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
