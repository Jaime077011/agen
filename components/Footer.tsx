'use client';
import { useEffect, useRef } from 'react';
import { useLang } from '@/lib/lang-context';

function chars(text: string) {
  return text.split('').map((c, i) => (
    <span key={i} className="char" style={{ whiteSpace: 'pre' }}>{c}</span>
  ));
}

const SOCIALS = [
  { label: 'Instagram', href: '#' },
  { label: 'LinkedIn', href: '#' },
  { label: 'Behance', href: '#' },
];

export function Footer() {
  const { lang } = useLang();
  const isAr = lang === 'ar';

  const sectionRef  = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLParagraphElement>(null);
  const metaRef     = useRef<HTMLDivElement>(null);
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
        const isMobile = window.matchMedia('(max-width: 768px)').matches;

        if (isMobile) {
          const trigger = (el: Element | null) => ({
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
          });

          const wChars = Array.from(wordmarkRef.current?.querySelectorAll('.char') ?? []);
          gsap.set(wordmarkRef.current, { opacity: 1 });
          gsap.fromTo(wChars,
            { opacity: 0, filter: 'blur(10px)' },
            { opacity: 1, filter: 'blur(0px)', stagger: 0.04, duration: 0.7, ease, ...trigger(wordmarkRef.current) });

          gsap.fromTo(metaRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, ease, ...trigger(metaRef.current) });

          gsap.fromTo(bottomRef.current,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.7, ease, ...trigger(bottomRef.current) });

        } else {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 1,
            },
          });

          // Wordmark chars blur in
          const wChars = Array.from(wordmarkRef.current?.querySelectorAll('.char') ?? []);
          tl.fromTo(wordmarkRef.current, { opacity: 0 }, { opacity: 1, duration: 0.1 });
          tl.fromTo(wChars,
            { opacity: 0, filter: 'blur(12px)' },
            { opacity: 1, filter: 'blur(0px)', stagger: 0.05, duration: 0.8, ease },
            '<+0.05');

          // Hold
          tl.to({}, { duration: 1.5 });

          // Meta slides up
          tl.fromTo(metaRef.current,
            { opacity: 0, y: 36 },
            { opacity: 1, y: 0, duration: 1, ease },
            '>');

          // Bottom bar
          tl.fromTo(bottomRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, ease },
            '>+0.4');

          // Hold at end
          tl.to({}, { duration: 2 });
        }
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

          <p className="footer-wordmark" ref={wordmarkRef}>
            {chars('The Archetypers')}
          </p>

          <div className="footer-meta" ref={metaRef}>
            <p className="footer-tagline">
              {isAr
                ? 'الاستراتيجية والتصميم والنمو — منظومة واحدة متكاملة.'
                : 'Strategy, design, and growth — built as one system.'}
            </p>
            <div className="footer-socials">
              {SOCIALS.map((s, i) => (
                <span key={s.label} style={{ display: 'contents' }}>
                  {i > 0 && <span className="footer-social-sep">·</span>}
                  <a href={s.href} className="footer-social" target="_blank" rel="noopener noreferrer">
                    {s.label}
                  </a>
                </span>
              ))}
            </div>
          </div>

          <div className="footer-bottom" ref={bottomRef}>
            <p className="footer-copy">
              &copy; {new Date().getFullYear()} The Archetypers.{' '}
              {isAr ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
            </p>
            <p className="footer-location">Cairo, Egypt</p>
          </div>

        </footer>
      </div>
    </div>
  );
}
