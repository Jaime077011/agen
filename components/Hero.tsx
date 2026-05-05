'use client';
import { useLang } from '@/lib/lang-context';

export function Hero() {
  const { t } = useLang();
  return (
    <section className="hero">
      <div className="hero-script-wrap anim-up" style={{ '--delay': '200ms' } as React.CSSProperties}>
        <span className="hero-script">{t.heroScript}</span>
      </div>
      <div className="hero-headline-wrap anim-up" style={{ '--delay': '350ms' } as React.CSSProperties}>
        <h1 className="hero-headline">{t.heroHeadline}</h1>
      </div>
      <div className="hero-tagline-wrap anim-up" style={{ '--delay': '480ms' } as React.CSSProperties}>
        <p className="hero-tagline">{t.heroTagline}</p>
      </div>
      <div className="hero-cta-wrap anim-up" style={{ '--delay': '550ms' } as React.CSSProperties}>
        <a href="#" className="hero-cta">
          {t.heroCta}
        </a>
        <p className="hero-cta-note">{t.heroNote}</p>
      </div>
    </section>
  );
}
