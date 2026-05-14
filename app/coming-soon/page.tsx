'use client';
import { Background } from '@/components/Background';
import { NoiseBackground } from '@/components/NoiseBackground';
import { CursorTracker } from '@/components/CursorTracker';
import { BodyLoader } from '@/components/BodyLoader';
import { ComingSoonSocial } from '@/components/ComingSoonSocial';
import { ControlPanel } from '@/components/ControlPanel';
import { LangOverlay } from '@/components/LangOverlay';
import { useLang } from '@/lib/lang-context';

export default function ComingSoon() {
  const { t } = useLang();
  return (
    <>
      <Background />
      <NoiseBackground />
      <LangOverlay />
      <CursorTracker />
      <BodyLoader />
      <ControlPanel />
      <div className="cs-wrapper">
        <section className="site-sticky">
          <div className="cs-top-logo anim-fade" style={{ '--delay': '100ms' } as React.CSSProperties}>
            <div className="cs-top-logo-clip">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/TheArchetypers-02.png" alt="The Archetypers" />
            </div>
          </div>
          <div className="site-hero-layer">
            <section className="hero">
              <div className="hero-script-wrap anim-up" style={{ '--delay': '200ms' } as React.CSSProperties}>
                <span className="hero-script">{t.csScript}</span>
              </div>
              <div className="hero-headline-wrap anim-up" style={{ '--delay': '350ms' } as React.CSSProperties}>
                <h1 className="hero-headline">{t.csHeadline}</h1>
              </div>
              <div className="hero-tagline-wrap anim-up" style={{ '--delay': '480ms' } as React.CSSProperties}>
                <p className="hero-tagline">{t.csTagline}</p>
              </div>
              <div className="hero-cta-wrap anim-up" style={{ '--delay': '550ms' } as React.CSSProperties}>
                <a href="/brief" className="hero-cta">{t.csCta}</a>
              </div>
            </section>
          </div>

          <ComingSoonSocial />
        </section>
      </div>
    </>
  );
}
