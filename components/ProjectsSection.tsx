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

const PROJECTS = [
  { number: '01', category: 'Brand Identity' },
  { number: '02', category: 'Web & Store' },
  { number: '03', category: 'AI Systems' },
  { number: '04', category: 'Brand Identity' },
  { number: '05', category: 'Web & Store' },
  { number: '06', category: 'AI Systems' },
  { number: '07', category: 'Brand Identity' },
  { number: '08', category: 'Web & Store' },
  { number: '09', category: 'AI Systems' },
  { number: '10', category: 'Brand Identity' },
  { number: '11', category: 'Web & Store' },
  { number: '12', category: 'AI Systems' },
];

const N = PROJECTS.length;

export function ProjectsSection() {
  const sectionRef    = useRef<HTMLDivElement>(null);
  const sceneRef      = useRef<HTMLDivElement>(null);
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

        // ── Card-by-card intro / exit ──────────────────────────────────────
        // We only animate opacity — transform is owned by the CSS spin animation
        // and cannot be touched by GSAP without breaking it.
        const cards = Array.from(sectionRef.current?.querySelectorAll('.ps-card') ?? []);
        gsap.set(cards, { opacity: 0 });

        // Intro: cards materialise left-to-right (index 0 → N-1)
        ScrollTrigger.create({
          trigger: sceneRef.current,
          start: 'top 75%',
          onEnter: () => gsap.to(cards, {
            opacity: 1,
            stagger: { amount: 1.6, from: 'start' },
            duration: 0.75, ease: 'power2.out',
          }),
          // Reverse: cards vanish right-to-left when scrolling back up
          onLeaveBack: () => gsap.to(cards, {
            opacity: 0,
            stagger: { amount: 0.8, from: 'end' },
            duration: 0.5, ease: 'power2.in',
          }),
        });

        // Exit: cards fade out left-to-right as section leaves
        ScrollTrigger.create({
          trigger: sceneRef.current,
          start: 'bottom 35%',
          onLeave: () => gsap.to(cards, {
            opacity: 0,
            stagger: { amount: 0.9, from: 'start' },
            duration: 0.55, ease: 'power2.in',
          }),
          // Re-enter from below: restore right-to-left
          onEnterBack: () => gsap.to(cards, {
            opacity: 1,
            stagger: { amount: 1.2, from: 'end' },
            duration: 0.75, ease: 'power2.out',
          }),
        });

        // Moment
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

      {/* 3D carousel */}
      <div className="ps-scene" ref={sceneRef}>
        <div
          className="ps-a3d"
          style={{ '--n': N } as React.CSSProperties}
        >
          {PROJECTS.map((p, i) => (
            <div
              key={i}
              className="ps-card"
              style={{ '--i': i } as React.CSSProperties}
            >
              <div className="ps-card-img" />
              <div className="ps-card-overlay">
                <span className="ps-overlay-num">#{p.number}</span>
                <span className="ps-overlay-cat">{p.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Moment */}
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
