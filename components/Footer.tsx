'use client';
import { useEffect, useRef } from 'react';

function chars(text: string) {
  return text.split('').map((c, i) => (
    <span key={i} className="char" style={{ whiteSpace: 'pre' }}>{c}</span>
  ));
}

export function Footer() {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const taglineRef  = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const brandRef    = useRef<HTMLParagraphElement>(null);
  const bottomRef   = useRef<HTMLDivElement>(null);

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
        const bChars = Array.from(brandRef.current?.querySelectorAll('.char') ?? []);

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
          },
        });

        tl.fromTo(taglineRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.7, ease },
          '>+0.3');

        tl.set(wordmarkRef.current, { opacity: 1 });
        tl.fromTo(bChars,
          { opacity: 0, filter: 'blur(14px)' },
          { opacity: 1, filter: 'blur(0px)', stagger: 0.04, duration: 0.9, ease },
          '<+0.2');

        tl.fromTo(bottomRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.6, ease },
          '>+0.2');

        tl.to({}, { duration: 2 });

      }, sectionRef);
    })();

    return () => {
      isCancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <div className="footer-section" ref={sectionRef}>
      <div className="footer-sticky">
        <footer className="footer">

          {/* Tagline strip */}
          <div className="footer-tagline-strip" ref={taglineRef}>
            <div className="footer-rule" />
            <p className="footer-tagline">Brand Strategy, Digital Growth, and Conversion</p>
            <div className="footer-rule" />
          </div>

          {/* Giant wordmark */}
          <div className="footer-wordmark" ref={wordmarkRef}>
            <span className="footer-script">The</span>
            <p className="footer-brand" ref={brandRef}>{chars('ARCHETYPERS')}</p>
          </div>

          {/* Copyright */}
          <div className="footer-bottom" ref={bottomRef}>
            <div className="footer-rule" />
            <p className="footer-copy">
              Copyright &copy; 2026 <strong>THE ARCHETYPERS</strong> , All rights reserved
            </p>
          </div>

        </footer>
      </div>
    </div>
  );
}
