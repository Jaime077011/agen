'use client';
import { useEffect, useRef } from 'react';

function wordChars(text: string, prefix: string) {
  return text.split(' ').map((word, wi) => (
    <span key={`${prefix}-w${wi}`} className="word-line">
      {word.split('').map((c, ci) => (
        <span key={`${prefix}-${wi}-${ci}`} className="char">{c}</span>
      ))}
    </span>
  ));
}

const FAN_ITEMS = [
  { number: null, category: null },
  { number: '01', category: 'Brand Identity' },
  { number: '02', category: 'Web & Store' },
  { number: '03', category: 'AI Systems' },
  { number: null, category: null },
];

const FAN_ROTATIONS = [-24, -12, 0, 12, 24];

export function ProjectsSection() {
  const sectionRef    = useRef<HTMLDivElement>(null);
  const headerRef     = useRef<HTMLDivElement>(null);
  const fanRef        = useRef<HTMLDivElement>(null);
  const momentAreaRef = useRef<HTMLDivElement>(null);
  const momentRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isCancelled = false;
    let ctx: { revert: () => void } | null = null;

    (async () => {
      const { default: gsap } = await import('gsap');
      const { ScrollTrigger }  = await import('gsap/ScrollTrigger');
      if (isCancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const dispatchNoiseMode = (mode: number) =>
          window.dispatchEvent(new CustomEvent('noise-mode', { detail: mode }));

        // ── Header entrance ──
        const headerEls = Array.from(headerRef.current?.children ?? []);
        gsap.set(headerEls, { opacity: 0, y: 36 });

        ScrollTrigger.create({
          trigger: headerRef.current,
          start: 'top 80%',
          onEnter: () => gsap.to(headerEls, {
            opacity: 1, y: 0, duration: 0.9, ease: 'power2.out', stagger: 0.13,
          }),
          onLeaveBack: () => gsap.set(headerEls, { opacity: 0, y: 36 }),
        });

        // ── Fan entrance ──
        const fanItems = Array.from(fanRef.current?.querySelectorAll('.ps-fan-item') ?? []);
        gsap.set(fanItems, { opacity: 0, y: 50 });

        ScrollTrigger.create({
          trigger: fanRef.current,
          start: 'top 85%',
          onEnter: () => gsap.to(fanItems, {
            opacity: 1, y: 0, duration: 1.0, ease: 'power2.out', stagger: 0.1,
          }),
          onLeaveBack: () => gsap.set(fanItems, { opacity: 0, y: 50 }),
        });

        // ── Moment ──
        const mChars = Array.from(momentRef.current?.querySelectorAll('.char') ?? []);

        const momentTl = gsap.timeline({
          scrollTrigger: {
            trigger: momentAreaRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
          },
        });

        momentTl.fromTo(momentRef.current, { opacity: 0 }, { opacity: 1, duration: 0.1,
          onStart: () => dispatchNoiseMode(1),
          onReverseComplete: () => dispatchNoiseMode(0) }, '>+0.2');
        momentTl.fromTo(mChars,
          { opacity: 0, filter: 'blur(12px)' },
          { opacity: 1, filter: 'blur(0px)', stagger: 0.07, duration: 0.8, ease: 'power2.out' },
          '<+0.05');
        momentTl.to({}, { duration: 2.5 });
        momentTl.to(mChars,
          { opacity: 0, filter: 'blur(12px)', stagger: 0.07, duration: 0.8, ease: 'power2.in',
            onStart: () => dispatchNoiseMode(0),
            onReverseComplete: () => dispatchNoiseMode(1) });
        momentTl.to(momentRef.current, { opacity: 0, duration: 0.3 }, '>-0.1');

      }, sectionRef);
    })();

    return () => {
      isCancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <div className="ps-section" ref={sectionRef}>

      {/* Fan content */}
      <div className="ps-fan-area">

        <div className="ps-header" ref={headerRef}>
          <span className="ps-label">Selected Work</span>
          <h2 className="ps-headline">Projects That<br />Deliver.</h2>
          <p className="ps-subtext">
            Brand identity, web, and AI systems — built for growth, not just good looks.
          </p>
          <a href="/projects" className="ps-cta-pill">
            View all projects
            <span className="ps-cta-arrow">→</span>
          </a>
        </div>

        <div className="ps-fan-row" ref={fanRef}>
          {FAN_ITEMS.map((item, i) => (
            <div
              key={i}
              className="ps-fan-item"
              style={{ '--fan-rot': `${FAN_ROTATIONS[i]}deg` } as React.CSSProperties}
            >
              <div className="ps-fan-card">
                <div className="ps-fan-img" />
              </div>
              <div className="ps-fan-label-group">
                {item.number && (
                  <>
                    <span className="ps-fan-num">#{item.number}</span>
                    <span className="ps-fan-name">{item.category}</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Moment — brief sticky before Testimonials */}
      <div className="ps-moment-area" ref={momentAreaRef}>
        <div className="ps-moment-sticky">
          <div className="ps-moment" ref={momentRef}>
            <p className="ps-moment-text">{wordChars('Hear from our clients.', 'ps-m')}</p>
          </div>
        </div>
      </div>

    </div>
  );
}
