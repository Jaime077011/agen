'use client';
import { useEffect, useRef } from 'react';

const SERVICES = [
  {
    num: '01',
    name: 'Brand Identity',
    desc: 'A brand system that earns trust, commands a position, and makes everything else work harder.',
  },
  {
    num: '02',
    name: 'Web & Store',
    desc: 'Sites and stores engineered for conversion — built on strategy, not just a good-looking template.',
  },
  {
    num: '03',
    name: 'AI Systems',
    desc: 'Automation and AI workflows that scale your output without scaling your headcount.',
  },
];

export function GrowthSection() {
  const wrapperRef   = useRef<HTMLDivElement>(null);
  const headlineRef  = useRef<HTMLHeadingElement>(null);
  const subtextRef   = useRef<HTMLParagraphElement>(null);
  const topRef       = useRef<HTMLDivElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const cardsRef     = useRef<HTMLDivElement>(null);
  const ctaRef       = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isCancelled = false;
    let ctx: { revert: () => void } | null = null;

    (async () => {
      const { default: gsap } = await import('gsap');
      const { ScrollTrigger }  = await import('gsap/ScrollTrigger');
      if (isCancelled) return;

      gsap.registerPlugin(ScrollTrigger);
      const ease = 'power2.out';

      ctx = gsap.context(() => {
        const isMobile = window.matchMedia('(max-width: 768px)').matches;

        if (isMobile) {
          gsap.fromTo(headlineRef.current,
            { opacity: 0, scale: 0.92, filter: 'blur(8px)' },
            { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.85, ease,
              scrollTrigger: { trigger: headlineRef.current, start: 'top 88%', toggleActions: 'play none none none' } });

          gsap.fromTo(subtextRef.current,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.65, ease,
              scrollTrigger: { trigger: subtextRef.current, start: 'top 88%', toggleActions: 'play none none none' } });

          gsap.fromTo(paragraphRef.current,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.65, ease,
              scrollTrigger: { trigger: paragraphRef.current, start: 'top 88%', toggleActions: 'play none none none' } });

          const cards = cardsRef.current?.querySelectorAll('.growth-card') ?? [];
          Array.from(cards).forEach((card, i) => {
            gsap.fromTo(card,
              { opacity: 0, y: 36 },
              { opacity: 1, y: 0, duration: 0.6, ease, delay: i * 0.1,
                scrollTrigger: { trigger: card, start: 'top 92%', toggleActions: 'play none none none' } });
          });

          gsap.fromTo(ctaRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease,
              scrollTrigger: { trigger: ctaRef.current, start: 'top 92%', toggleActions: 'play none none none' } });

        } else {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: wrapperRef.current,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 1.5,
            },
          });

          // Step 1 — headline: camera focus snap
          tl.fromTo(headlineRef.current,
            { opacity: 0, scale: 0.84, filter: 'blur(14px)' },
            { opacity: 1, scale: 1,    filter: 'blur(0px)',  duration: 3, ease });

          // Step 2 — subtext fades up a beat later
          tl.fromTo(subtextRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 2, ease },
            '-=1.2');

          tl.to({}, { duration: 1.5 });

          // Step 3 — top drifts up, paragraph reveals
          tl.to(topRef.current,  { y: -90, duration: 2.5, ease: 'power2.inOut' });
          tl.fromTo(paragraphRef.current,
            { opacity: 0, y: 28 },
            { opacity: 1, y: 0,  duration: 2, ease },
            '<+0.6');

          tl.to({}, { duration: 1.2 });

          // Step 4 — cards slide in with stagger
          const cards = cardsRef.current?.querySelectorAll('.growth-card') ?? [];
          tl.fromTo(Array.from(cards),
            { x: -56, opacity: 0 },
            { x: 0,   opacity: 1, stagger: 0.4, duration: 1.2, ease });

          // Step 5 — CTA appears
          tl.fromTo(ctaRef.current,
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 1, ease },
            '<+0.8');
        }
      }, wrapperRef);
    })();

    return () => {
      isCancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <div className="growth-wrapper" ref={wrapperRef}>
      <section className="growth-section">
        <div className="growth-content">

          <div className="growth-top" ref={topRef}>
            <h2 className="growth-headline" ref={headlineRef}>
              We help ambitious<br />
              brands <span className="growth-accent">grow.</span>
            </h2>
            <p className="growth-subtext" ref={subtextRef}>
              Not just look better. Actually grow.
            </p>
          </div>

          <p className="growth-paragraph" ref={paragraphRef}>
            Most businesses have the product. They&apos;re missing the system. We build
            the brand, the store, the automation, and the content — all connected, all
            working toward one thing: growth.
          </p>

          <div className="growth-cards" ref={cardsRef}>
            {SERVICES.map(s => (
              <div key={s.name} className="growth-card">
                <span className="growth-card-num">{s.num}</span>
                <p className="growth-card-name">{s.name}</p>
                <p className="growth-card-desc">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="growth-cta-wrap" ref={ctaRef}>
            <a href="/services" className="growth-cta">
              Explore all services
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>

        </div>
      </section>
    </div>
  );
}
