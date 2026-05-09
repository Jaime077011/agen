'use client';
import { useEffect, useRef } from 'react';
import { playMoment } from '@/lib/sounds';
import { Nav } from './Nav';
import { Hero } from './Hero';
import { BottomRow } from './BottomRow';

const SERVICES = [
  {
    name: 'Brand Identity',
    cta: "Let's build your brand",
  },
  {
    name: 'Web & Store',
    cta: 'Launch your store',
  },
  {
    name: 'AI Systems',
    cta: 'Scale with automation',
  },
];

function chars(text: string, prefix: string) {
  return text.split('').map((c, i) => (
    <span key={`${prefix}-${i}`} className="char">
      {c}
    </span>
  ));
}

function wordChars(text: string, prefix: string) {
  return text.split(' ').map((word, wi) => (
    <span key={`${prefix}-w${wi}`} className="word-line">
      {word.split('').map((c, ci) => (
        <span key={`${prefix}-${wi}-${ci}`} className="char">{c}</span>
      ))}
    </span>
  ));
}

export function SiteSection() {
  const wrapperRef        = useRef<HTMLDivElement>(null);
  const heroLayerRef      = useRef<HTMLDivElement>(null);
  const moment1Ref        = useRef<HTMLDivElement>(null);
  const moment2Ref        = useRef<HTMLDivElement>(null);
  const moment3Ref        = useRef<HTMLDivElement>(null);
  const moment4Ref        = useRef<HTMLDivElement>(null);
  const headlineRef       = useRef<HTMLHeadingElement>(null);
  const subtextRef        = useRef<HTMLParagraphElement>(null);
  const topRef            = useRef<HTMLDivElement>(null);
  const cardsRef          = useRef<HTMLDivElement>(null);
  const ctaRef            = useRef<HTMLDivElement>(null);
  const growthContentRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isCancelled = false;
    let ctx: { revert: () => void } | null = null;

    (async () => {
      const { default: gsap } = await import('gsap');
      const { ScrollTrigger }  = await import('gsap/ScrollTrigger');
      if (isCancelled) return;

      gsap.registerPlugin(ScrollTrigger);
      const ease = 'power2.out';
      const isMobile = window.matchMedia('(max-width: 768px)').matches;

      ctx = gsap.context(() => {
          // ── Scrubbed timeline — all screen sizes ─────────────────────────
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: wrapperRef.current,
              start: 'top top',
              end: 'bottom bottom',
              scrub: isMobile ? 0.3 : 1,
            },
          });

          // Hero exit — skip expensive blur filter on mobile to reduce GPU load
          if (isMobile) {
            tl.fromTo(heroLayerRef.current,
              { opacity: 1, scale: 1 },
              { opacity: 0, scale: 1.03, duration: 0.9, ease: 'power2.inOut' },
              '>');
          } else {
            tl.fromTo(heroLayerRef.current,
              { opacity: 1, filter: 'blur(0px)', scale: 1 },
              { opacity: 0, filter: 'blur(18px)', scale: 1.05, duration: 0.9, ease: 'power2.inOut' },
              '>');
          }
          // Disable pointer events so the invisible hero layer doesn't block the growth layer
          tl.set(heroLayerRef.current, { pointerEvents: 'none' });

          // Breathing room — empty dark frame
          tl.to({}, { duration: 1 });

          // ── Moment 1: camera rack-focus — materialises from depth ──
          const m1Chars = Array.from(moment1Ref.current?.querySelectorAll('.char') ?? []);
          tl.fromTo(moment1Ref.current,
            { opacity: 0, scale: 0.91, ...(isMobile ? {} : { filter: 'blur(24px)' }) },
            { opacity: 1, scale: 1,    ...(isMobile ? {} : { filter: 'blur(0px)' }),  duration: 1.4, ease: 'power2.out', onStart: playMoment },
            '>');
          tl.fromTo(m1Chars,
            { opacity: 0, ...(isMobile ? {} : { filter: 'blur(10px)' }) },
            { opacity: 1, ...(isMobile ? {} : { filter: 'blur(0px)' }), stagger: 0.055, duration: 0.8, ease },
            '<+0.4');

          // Hold on moment 1
          tl.to({}, { duration: 2 });

          // Moment 1 exits char by char
          tl.to(m1Chars,
            { opacity: 0, ...(isMobile ? {} : { filter: 'blur(12px)' }), stagger: 0.07, duration: 0.8, ease: 'power2.in' });
          tl.to(moment1Ref.current, { opacity: 0, duration: 0.01 }, '<+1.4');

          // ── Moment 2: chars blur in ───────────────────────────────────────
          const m2Chars = Array.from(moment2Ref.current?.querySelectorAll('.char') ?? []);
          tl.fromTo(moment2Ref.current, { opacity: 0 }, { opacity: 1, duration: 0.1, ease, onStart: playMoment }, '>+0.3');
          tl.fromTo(m2Chars,
            { opacity: 0, ...(isMobile ? {} : { filter: 'blur(12px)' }) },
            { opacity: 1, ...(isMobile ? {} : { filter: 'blur(0px)' }), stagger: 0.07, duration: 0.8, ease },
            '<+0.05');

          // Hold on moment 2
          tl.to({}, { duration: 2 });

          // Moment 2 exits char by char
          tl.to(m2Chars,
            { opacity: 0, ...(isMobile ? {} : { filter: 'blur(12px)' }), stagger: 0.07, duration: 0.8, ease: 'power2.in' });
          tl.to(moment2Ref.current, { opacity: 0, duration: 0.01 }, '<+1.4');

          // ── Headline: char-by-char blur L→R ──────────────────────────────
          const hChars = Array.from(headlineRef.current?.querySelectorAll('.char') ?? []);
          tl.set(headlineRef.current, { opacity: 1 }, '>+0.4');
          tl.fromTo(hChars,
            { opacity: 0, ...(isMobile ? {} : { filter: 'blur(10px)' }) },
            { opacity: 1, ...(isMobile ? {} : { filter: 'blur(0px)' }), stagger: 0.06, duration: 0.7, ease },
            '<');

          // ── Subtext: slide in from left ───────────────────────────────────
          tl.fromTo(subtextRef.current,
            { opacity: 0, x: -40 },
            { opacity: 1, x: 0, duration: 1.4, ease },
            '>+0.5');

          tl.to({}, { duration: 1.2 });

          // ── Services: staggered row reveal
          const serviceRows = Array.from(cardsRef.current?.querySelectorAll('.service-row') ?? []);
          serviceRows.forEach((row, i) => {
            tl.fromTo(row,
              { opacity: 0, x: -28, pointerEvents: 'none' },
              { opacity: 1, x: 0, duration: 0.85, ease },
              i === 0 ? '>' : '<+0.55');
          });
          // Enable pointer events only after all rows are visible; reverses on scroll back
          if (serviceRows.length) tl.set(serviceRows, { pointerEvents: 'auto' });

          // ── CTA: slide in from left ───────────────────────────────────────
          tl.fromTo(ctaRef.current,
            { opacity: 0, x: -40 },
            { opacity: 1, x: 0, duration: 1.2, ease },
            '>+0.6');

          // Hold on services content
          tl.to({}, { duration: 1.5 });

          // ── Services content exits as one unit ────────────────────────────
          tl.to(growthContentRef.current,
            { opacity: 0, ...(isMobile ? {} : { filter: 'blur(14px)' }), scale: 1.03, duration: 0.9, ease: 'power2.inOut' });
          tl.set(growthContentRef.current, { pointerEvents: 'none' });
          tl.set(serviceRows, { pointerEvents: 'none' });

          // Breathing room
          tl.to({}, { duration: 0.8 });

          // ── Moment 3: rack-focus entry ────────────────────────────────────
          const m3Chars = Array.from(moment3Ref.current?.querySelectorAll('.char') ?? []);
          tl.fromTo(moment3Ref.current,
            { opacity: 0, scale: 0.91, ...(isMobile ? {} : { filter: 'blur(24px)' }) },
            { opacity: 1, scale: 1,    ...(isMobile ? {} : { filter: 'blur(0px)' }),  duration: 1.4, ease: 'power2.out', onStart: playMoment },
            '>');
          tl.fromTo(m3Chars,
            { opacity: 0, ...(isMobile ? {} : { filter: 'blur(10px)' }) },
            { opacity: 1, ...(isMobile ? {} : { filter: 'blur(0px)' }), stagger: 0.055, duration: 0.8, ease },
            '<+0.4');

          // Hold on moment 3
          tl.to({}, { duration: 2 });

          // Moment 3 exits char by char
          tl.to(m3Chars,
            { opacity: 0, ...(isMobile ? {} : { filter: 'blur(12px)' }), stagger: 0.07, duration: 0.8, ease: 'power2.in' });
          tl.to(moment3Ref.current, { opacity: 0, duration: 0.01 }, '<+1.4');

          // ── Moment 4: chars blur in ───────────────────────────────────────
          const m4Chars = Array.from(moment4Ref.current?.querySelectorAll('.char') ?? []);
          tl.fromTo(moment4Ref.current, { opacity: 0 }, { opacity: 1, duration: 0.1, ease, onStart: playMoment }, '>+0.3');
          tl.fromTo(m4Chars,
            { opacity: 0, ...(isMobile ? {} : { filter: 'blur(12px)' }) },
            { opacity: 1, ...(isMobile ? {} : { filter: 'blur(0px)' }), stagger: 0.07, duration: 0.8, ease },
            '<+0.05');

          // Hold on moment 4
          tl.to({}, { duration: 1.2 });

          // Moment 4 exits
          tl.to(m4Chars,
            { opacity: 0, ...(isMobile ? {} : { filter: 'blur(12px)' }), stagger: 0.07, duration: 0.8, ease: 'power2.in' });
          tl.to(moment4Ref.current, { opacity: 0, duration: 0.01 }, '<+1.4');
      }, wrapperRef);

      // Refresh after layout settles (fonts, images, iOS viewport resize)
      setTimeout(() => { if (!isCancelled) ScrollTrigger.refresh(); }, 300);
    })();

    return () => {
      isCancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <div className="site-wrapper" ref={wrapperRef}>
      <section className="site-sticky">

        {/* Nav — floats above both layers */}
        <div className="site-nav">
          <Nav />
        </div>

        {/* Hero layer — exits on scroll */}
        <div className="site-hero-layer" ref={heroLayerRef}>
          <Hero />
          <BottomRow />
        </div>

        {/* Growth layer */}
        <div className="site-growth-layer">

          {/* Moment 1 — full-screen centered headline */}
          <div className="growth-moment" ref={moment1Ref}>
            <p className="growth-moment-text">
              {wordChars('We help you grow.', 'm1')}
            </p>
          </div>

          {/* Moment 2 — full-screen centered headline */}
          <div className="growth-moment" ref={moment2Ref}>
            <p className="growth-moment-text">
              {wordChars('We get you results.', 'm2')}
            </p>
          </div>

          {/* Moment 3 — after services, leads into projects */}
          <div className="growth-moment" ref={moment3Ref}>
            <p className="growth-moment-text">
              {wordChars('Built to perform.', 'm3')}
            </p>
          </div>

          {/* Moment 4 — transitions into projects showcase */}
          <div className="growth-moment" ref={moment4Ref}>
            <p className="growth-moment-text">
              {wordChars('Proof, not promises.', 'm4')}
            </p>
          </div>

          {/* Services content */}
          <div className="growth-content" ref={growthContentRef}>

            <div className="growth-top" ref={topRef}>
              <h2 className="growth-headline" ref={headlineRef}>
                {chars('We help brands ', 'h1')}
                <span className="growth-accent">{chars('grow.', 'h2')}</span>
              </h2>
              <p className="growth-subtext" ref={subtextRef}>
                Not just look better. Actually grow.
              </p>
            </div>

            <div className="services-list" ref={cardsRef}>
              {SERVICES.map((s) => (
                <a key={s.name} href="/services" className="service-row">
                  {s.name}
                  <span className="service-hover-bg">{s.cta}</span>
                </a>
              ))}
            </div>

            <div className="growth-cta-wrap" ref={ctaRef}>
              <a href="/services" className="growth-cta">
                Explore all services
              </a>
            </div>

          </div>
        </div>

      </section>
    </div>
  );
}
