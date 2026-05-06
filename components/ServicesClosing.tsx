'use client';
import { useEffect, useRef } from 'react';

function chars(text: string) {
  return text.split('').map((c, i) => (
    <span key={i} className="char" style={{ whiteSpace: 'pre' }}>{c}</span>
  ));
}

export function ServicesClosing() {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const wrapRef     = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const ctaRef      = useRef<HTMLDivElement>(null);

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
          const trigger = (el: Element | null) => ({
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
          });

          const hChars = Array.from(headlineRef.current?.querySelectorAll('.char') ?? []);
          gsap.set(wrapRef.current, { opacity: 1 });
          gsap.fromTo(hChars,
            { opacity: 0, filter: 'blur(10px)' },
            { opacity: 1, filter: 'blur(0px)', stagger: 0.03, duration: 0.6, ease, ...trigger(headlineRef.current) });

          gsap.fromTo(ctaRef.current,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.8, ease, ...trigger(ctaRef.current) });

        } else {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 1.5,
            },
          });

          tl.set(wrapRef.current, { opacity: 1 });

          const hChars = Array.from(headlineRef.current?.querySelectorAll('.char') ?? []);
          tl.fromTo(hChars,
            { opacity: 0, filter: 'blur(12px)' },
            { opacity: 1, filter: 'blur(0px)', stagger: 0.06, duration: 0.9, ease });

          tl.fromTo(ctaRef.current,
            { opacity: 0, y: 32 },
            { opacity: 1, y: 0, duration: 1, ease },
            '>+0.4');

          tl.to({}, { duration: 3 });
        }
      }, sectionRef);
    })();

    return () => {
      isCancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <div className="srvc-section" ref={sectionRef}>
      <div className="srvc-sticky">
        <div className="srvc-wrap" ref={wrapRef}>
          <h2 className="srvc-headline" ref={headlineRef}>
            {chars('Ready to ')}
            <span className="srvc-accent">{chars('begin?')}</span>
          </h2>
          <div className="srvc-cta" ref={ctaRef}>
            <a href="/#contact" className="hero-cta">Start your project</a>
            <p className="srvc-note">No commitment. One conversation.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
