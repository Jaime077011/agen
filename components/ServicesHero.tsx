'use client';
import { useEffect, useRef } from 'react';
import { Nav } from './Nav';

function chars(text: string) {
  return text.split('').map((c, i) => (
    <span key={i} className="char" style={{ whiteSpace: 'pre' }}>{c}</span>
  ));
}

export function ServicesHero() {
  const kickerRef   = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef      = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;

    (async () => {
      const { default: gsap } = await import('gsap');
      const ease = 'power2.out';

      ctx = gsap.context(() => {
        const hChars = Array.from(headlineRef.current?.querySelectorAll('.char') ?? []);
        const tl = gsap.timeline({ delay: 0.3 });

        tl.fromTo(kickerRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.7, ease });

        tl.fromTo(hChars,
          { opacity: 0, filter: 'blur(14px)' },
          { opacity: 1, filter: 'blur(0px)', stagger: 0.04, duration: 0.7, ease },
          '<+0.2');

        tl.fromTo(subRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.8, ease },
          '>+0.1');
      });
    })();

    return () => { ctx?.revert(); };
  }, []);

  return (
    <section className="srv-hero-section">
      <div className="srv-hero-nav">
        <Nav />
      </div>
      <div className="srv-hero-body">
        <span className="srv-hero-kicker" ref={kickerRef}>Our Services</span>
        <h1 className="srv-hero-headline" ref={headlineRef}>
          {chars('SERVICES')}
        </h1>
        <p className="srv-hero-sub" ref={subRef}>
          Brand Identity&nbsp;&nbsp;·&nbsp;&nbsp;Web &amp; Store&nbsp;&nbsp;·&nbsp;&nbsp;AI Systems
        </p>
      </div>
    </section>
  );
}
