'use client';
import { useEffect, useRef } from 'react';
import { useLang } from '@/lib/lang-context';

function chars(text: string) {
  return text.split('').map((c, i) => (
    <span key={i} className="char">{c === ' ' ? ' ' : c}</span>
  ));
}

const SOCIALS = [
  { label: 'Instagram', href: '#' },
  { label: 'LinkedIn', href: '#' },
  { label: 'Behance', href: '#' },
];

export function ContactSection() {
  const { lang } = useLang();
  const isAr = lang === 'ar';

  const sectionRef      = useRef<HTMLDivElement>(null);
  const momentRef       = useRef<HTMLDivElement>(null);
  const contentRef      = useRef<HTMLDivElement>(null);
  const headlineRef     = useRef<HTMLHeadingElement>(null);
  const subtextRef      = useRef<HTMLParagraphElement>(null);
  const fieldsRef       = useRef<HTMLDivElement>(null);
  const ctaRef          = useRef<HTMLDivElement>(null);
  const footerStripRef  = useRef<HTMLDivElement>(null);

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
          gsap.set(contentRef.current, { opacity: 1 });
          gsap.fromTo(hChars,
            { opacity: 0, filter: 'blur(10px)' },
            { opacity: 1, filter: 'blur(0px)', stagger: 0.03, duration: 0.6, ease, ...trigger(headlineRef.current) });

          gsap.fromTo(subtextRef.current,
            { opacity: 0, x: -30 },
            { opacity: 1, x: 0, duration: 0.9, ease, ...trigger(subtextRef.current) });

          const fields = Array.from(fieldsRef.current?.querySelectorAll('.cs-field') ?? []);
          fields.forEach(field => {
            gsap.fromTo(field,
              { opacity: 0, x: -20 },
              { opacity: 1, x: 0, duration: 0.7, ease, ...trigger(field) });
          });

          gsap.fromTo(ctaRef.current,
            { opacity: 0, x: -30 },
            { opacity: 1, x: 0, duration: 0.9, ease, ...trigger(ctaRef.current) });

          gsap.set(footerStripRef.current, { opacity: 1 });

        } else {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 1,
            },
          });

          // ── Moment: blur in ─────────────────────────────────────────────
          const mChars = Array.from(momentRef.current?.querySelectorAll('.char') ?? []);
          tl.fromTo(momentRef.current, { opacity: 0 }, { opacity: 1, duration: 0.1 });
          tl.fromTo(mChars,
            { opacity: 0, filter: 'blur(12px)' },
            { opacity: 1, filter: 'blur(0px)', stagger: 0.07, duration: 0.8, ease },
            '<+0.05');

          tl.to({}, { duration: 1.8 });

          // Moment exits
          tl.to(mChars,
            { opacity: 0, filter: 'blur(12px)', stagger: 0.07, duration: 0.8, ease: 'power2.in' });
          tl.to(momentRef.current, { opacity: 0, duration: 0.3 }, '>-0.1');

          tl.to({}, { duration: 0.6 });

          // ── Contact content reveal ───────────────────────────────────────
          tl.set(contentRef.current, { opacity: 1 });

          const hChars = Array.from(headlineRef.current?.querySelectorAll('.char') ?? []);
          tl.fromTo(hChars,
            { opacity: 0, filter: 'blur(10px)' },
            { opacity: 1, filter: 'blur(0px)', stagger: 0.04, duration: 0.7, ease });

          tl.fromTo(subtextRef.current,
            { opacity: 0, x: -40 },
            { opacity: 1, x: 0, duration: 1.2, ease },
            '>+0.3');

          const fields = Array.from(fieldsRef.current?.querySelectorAll('.cs-field') ?? []);
          fields.forEach((field, i) => {
            tl.fromTo(field,
              { opacity: 0, x: -24 },
              { opacity: 1, x: 0, duration: 0.75, ease },
              i === 0 ? '>+0.3' : '<+0.45');
          });

          tl.fromTo(ctaRef.current,
            { opacity: 0, x: -40 },
            { opacity: 1, x: 0, duration: 1.2, ease },
            '>+0.4');

          // Hold
          tl.to({}, { duration: 2 });

          // ── Footer strip slides up ───────────────────────────────────────
          tl.fromTo(footerStripRef.current,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 1, ease },
            '>');

          // Hold at end
          tl.to({}, { duration: 2.5 });
        }
      }, sectionRef);
    })();

    return () => {
      isCancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <div className="cs-section" ref={sectionRef}>
      <div className="cs-sticky">

        {/* Moment */}
        <div className="cs-moment" ref={momentRef}>
          <p className="cs-moment-text">{chars("Let's work together.")}</p>
        </div>

        {/* Contact content */}
        <div className="cs-content" ref={contentRef}>

          <div className="cs-left">
            <h2 className="cs-headline" ref={headlineRef}>
              {chars('Start your ')}
              <span className="cs-accent">{chars('project.')}</span>
            </h2>
            <p className="cs-subtext" ref={subtextRef}>
              Tell us what you&apos;re building.<br />We&apos;ll tell you exactly how we can help.
            </p>
          </div>

          <div className="cs-right">
            <div className="cs-fields" ref={fieldsRef}>
              <div className="cs-field">
                <label className="cs-label">Name</label>
                <input className="cs-input" type="text" placeholder="Your name" />
              </div>
              <div className="cs-field">
                <label className="cs-label">Email</label>
                <input className="cs-input" type="email" placeholder="your@email.com" />
              </div>
              <div className="cs-field">
                <label className="cs-label">Message</label>
                <textarea className="cs-textarea" placeholder="Tell us about your project…" />
              </div>
            </div>
            <div className="cs-cta-wrap" ref={ctaRef}>
              <button className="hero-cta cs-submit" type="submit">Send message</button>
            </div>
          </div>

        </div>

        {/* Footer strip */}
        <div className="cs-footer-strip" ref={footerStripRef}>
          <div className="cs-footer-meta">
            <p className="cs-footer-tagline">
              {isAr
                ? 'الاستراتيجية والتصميم والنمو — منظومة واحدة متكاملة.'
                : 'Strategy, design, and growth — built as one system.'}
            </p>
            <div className="cs-footer-socials">
              {SOCIALS.map((s, i) => (
                <span key={s.label} style={{ display: 'contents' }}>
                  {i > 0 && <span className="cs-footer-sep">·</span>}
                  <a href={s.href} className="cs-footer-social" target="_blank" rel="noopener noreferrer">
                    {s.label}
                  </a>
                </span>
              ))}
            </div>
          </div>
          <div className="cs-footer-bottom">
            <p className="cs-footer-copy">
              &copy; {new Date().getFullYear()} The Archetypers.{' '}
              {isAr ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
            </p>
            <p className="cs-footer-location">Cairo, Egypt</p>
          </div>
        </div>

      </div>
    </div>
  );
}
