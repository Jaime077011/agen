'use client';
import { useEffect, useRef } from 'react';
import { Nav } from './Nav';

function chars(text: string) {
  return text.split('').map((c, i) => (
    <span key={i} className="char" style={{ whiteSpace: 'pre' }}>{c}</span>
  ));
}

export function ProjectsHero() {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const taglineRef  = useRef<HTMLParagraphElement>(null);
  const bottomRef   = useRef<HTMLDivElement>(null);
  const arrowRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;

    (async () => {
      const { default: gsap } = await import('gsap');
      const ease = 'power2.out';

      ctx = gsap.context(() => {
        const hChars = Array.from(headlineRef.current?.querySelectorAll('.char') ?? []);
        const tl = gsap.timeline({ delay: 0.25 });

        tl.set(headlineRef.current, { opacity: 1 });
        tl.fromTo(hChars,
          { opacity: 0, filter: 'blur(14px)' },
          { opacity: 1, filter: 'blur(0px)', stagger: 0.04, duration: 0.7, ease });

        tl.fromTo(taglineRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.7, ease },
          '>');

        tl.fromTo(bottomRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease },
          '>+0.1');

        tl.fromTo(arrowRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.5,
            ease,
            onComplete: () => {
              if (arrowRef.current) {
                arrowRef.current.style.animationPlayState = 'running';
              }
            },
          },
          '>');
      });
    })();

    return () => { ctx?.revert(); };
  }, []);

  return (
    <section className="prj-hero-section">
      <div className="prj-hero-nav">
        <Nav />
      </div>

      <div className="prj-hero-center">
        <h1 className="prj-hero-headline" ref={headlineRef}>
          {chars('PROJECTS')}
        </h1>
        <p className="prj-hero-tagline" ref={taglineRef}>
          Brand Identity&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;Web &amp; Store&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;AI Systems
        </p>
      </div>

      <div className="prj-hero-bottom" ref={bottomRef}>
        <p className="prj-hero-desc">
          Real work, real results — case studies<br />from clients we&apos;ve helped grow.
        </p>
        <a href="/contact" className="prj-hero-link">
          Start a project<span className="prj-hero-link-arrow"> →</span>
        </a>
      </div>

      <div className="prj-hero-scroll" ref={arrowRef}>
        <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
          <line x1="8" y1="0" x2="8" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <polyline points="3,11 8,16 13,11" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </section>
  );
}
