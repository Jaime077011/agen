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

        // Scene fade-in
        gsap.set(sceneRef.current, { opacity: 0 });
        ScrollTrigger.create({
          trigger: sceneRef.current,
          start: 'top 85%',
          onEnter: () => gsap.to(sceneRef.current, { opacity: 1, duration: 1.4, ease: 'power2.out' }),
          onLeaveBack: () => gsap.set(sceneRef.current, { opacity: 0 }),
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
