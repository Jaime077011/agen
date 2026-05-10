'use client';
import { useEffect, useRef } from 'react';

export function ProjectsCTA() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isCancelled = false;
    let ctx: { revert: () => void } | null = null;

    (async () => {
      const { default: gsap } = await import('gsap');
      const { ScrollTrigger }  = await import('gsap/ScrollTrigger');
      if (isCancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const isMobile = window.matchMedia('(max-width: 768px)').matches;

        gsap.fromTo(
          wrapRef.current,
          { opacity: 0, y: isMobile ? 20 : 32 },
          {
            opacity: 1, y: 0, duration: 1.1, ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 82%',
              toggleActions: 'play none none none',
            },
          },
        );
      }, sectionRef);
    })();

    return () => { isCancelled = true; ctx?.revert(); };
  }, []);

  return (
    <div className="pcta-section" ref={sectionRef}>
      <div className="pcta-wrap" ref={wrapRef}>
        <p className="pcta-label">Brand · Web · AI</p>
        <h2 className="pcta-headline">12 projects.<br />Every one deliberate.</h2>
        <a href="/projects" className="hero-cta">See all projects</a>
      </div>
    </div>
  );
}
