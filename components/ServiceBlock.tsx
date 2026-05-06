'use client';
import { useEffect, useRef } from 'react';

function chars(text: string) {
  return text.split('').map((c, i) => (
    <span key={i} className="char" style={{ whiteSpace: 'pre' }}>{c}</span>
  ));
}

interface Props {
  momentText: string;
  number: string;
  name: string;
  tagline: string;
  description: string;
  deliverables: string[];
  ctaLabel: string;
}

export function ServiceBlock({
  momentText,
  number,
  name,
  tagline,
  description,
  deliverables,
  ctaLabel,
}: Props) {
  const sectionRef      = useRef<HTMLDivElement>(null);
  const momentRef       = useRef<HTMLDivElement>(null);
  const contentRef      = useRef<HTMLDivElement>(null);
  const ghostRef        = useRef<HTMLSpanElement>(null);
  const numTagRef       = useRef<HTMLSpanElement>(null);
  const nameRef         = useRef<HTMLHeadingElement>(null);
  const taglineRef      = useRef<HTMLParagraphElement>(null);
  const descRef         = useRef<HTMLParagraphElement>(null);
  const deliverablesRef = useRef<HTMLUListElement>(null);
  const ctaWrapRef      = useRef<HTMLDivElement>(null);

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

          gsap.set(contentRef.current, { opacity: 1 });

          gsap.fromTo(numTagRef.current,
            { opacity: 0, x: -20 },
            { opacity: 1, x: 0, duration: 0.6, ease, ...trigger(numTagRef.current) });

          const nChars = Array.from(nameRef.current?.querySelectorAll('.char') ?? []);
          gsap.fromTo(nChars,
            { opacity: 0, filter: 'blur(10px)' },
            { opacity: 1, filter: 'blur(0px)', stagger: 0.03, duration: 0.6, ease, ...trigger(nameRef.current) });

          gsap.fromTo(taglineRef.current,
            { opacity: 0, x: -20 },
            { opacity: 1, x: 0, duration: 0.7, ease, ...trigger(taglineRef.current) });

          gsap.fromTo(descRef.current,
            { opacity: 0, x: -20 },
            { opacity: 1, x: 0, duration: 0.8, ease, ...trigger(descRef.current) });

          const items = Array.from(deliverablesRef.current?.querySelectorAll('.srv-deliverable') ?? []);
          items.forEach(item => {
            gsap.fromTo(item,
              { opacity: 0, x: -16 },
              { opacity: 1, x: 0, duration: 0.6, ease, ...trigger(item) });
          });

          gsap.fromTo(ctaWrapRef.current,
            { opacity: 0, x: -20 },
            { opacity: 1, x: 0, duration: 0.7, ease, ...trigger(ctaWrapRef.current) });

        } else {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 1.5,
            },
          });

          // ── Moment enters ────────────────────────────────────────────────
          const mChars = Array.from(momentRef.current?.querySelectorAll('.char') ?? []);
          tl.fromTo(momentRef.current, { opacity: 0 }, { opacity: 1, duration: 0.1 });
          tl.fromTo(mChars,
            { opacity: 0, filter: 'blur(12px)' },
            { opacity: 1, filter: 'blur(0px)', stagger: 0.06, duration: 0.8, ease },
            '<+0.05');

          tl.to({}, { duration: 2 });

          // ── Moment exits ─────────────────────────────────────────────────
          tl.to(mChars,
            { opacity: 0, filter: 'blur(12px)', stagger: 0.05, duration: 0.6, ease: 'power2.in' });
          tl.to(momentRef.current, { opacity: 0, duration: 0.3 }, '>-0.1');

          tl.to({}, { duration: 0.6 });

          // ── Content reveals ───────────────────────────────────────────────
          tl.set(contentRef.current, { opacity: 1 });

          tl.fromTo(ghostRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.8, ease });

          tl.fromTo(numTagRef.current,
            { opacity: 0, x: -28 },
            { opacity: 1, x: 0, duration: 0.6, ease },
            '<+0.3');

          const nChars = Array.from(nameRef.current?.querySelectorAll('.char') ?? []);
          tl.fromTo(nChars,
            { opacity: 0, filter: 'blur(10px)' },
            { opacity: 1, filter: 'blur(0px)', stagger: 0.04, duration: 0.7, ease },
            '<+0.2');

          tl.fromTo(taglineRef.current,
            { opacity: 0, x: -28 },
            { opacity: 1, x: 0, duration: 0.7, ease },
            '>+0.2');

          tl.fromTo(descRef.current,
            { opacity: 0, x: -28 },
            { opacity: 1, x: 0, duration: 1, ease },
            '>+0.3');

          const items = Array.from(deliverablesRef.current?.querySelectorAll('.srv-deliverable') ?? []);
          tl.fromTo(items,
            { opacity: 0, x: -20 },
            { opacity: 1, x: 0, stagger: 0.1, duration: 0.6, ease },
            '>+0.2');

          tl.fromTo(ctaWrapRef.current,
            { opacity: 0, x: -28 },
            { opacity: 1, x: 0, duration: 0.8, ease },
            '>+0.3');

          // ── Hold ─────────────────────────────────────────────────────────
          tl.to({}, { duration: 2 });

          // ── Exit ─────────────────────────────────────────────────────────
          tl.to(contentRef.current, {
            opacity: 0,
            filter: 'blur(14px)',
            scale: 1.02,
            duration: 1,
            ease: 'power2.inOut',
          });
        }
      }, sectionRef);
    })();

    return () => {
      isCancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <div className="srv-section" ref={sectionRef}>
      <div className="srv-sticky">

        {/* Moment */}
        <div className="srv-moment" ref={momentRef}>
          <p className="srv-moment-text">{chars(momentText)}</p>
        </div>

        {/* Content */}
        <div className="srv-content" ref={contentRef}>
          <span className="srv-ghost-num" ref={ghostRef}>{number}</span>

          <div className="srv-left">
            <span className="srv-num-tag" ref={numTagRef}>{number}</span>
            <h2 className="srv-name" ref={nameRef}>{chars(name)}</h2>
            <p className="srv-tagline" ref={taglineRef}>{tagline}</p>
          </div>

          <div className="srv-right">
            <p className="srv-description" ref={descRef}>{description}</p>
            <ul className="srv-deliverables" ref={deliverablesRef}>
              {deliverables.map((d, i) => (
                <li key={i} className="srv-deliverable">
                  <span className="srv-deliverable-bar" />
                  <span className="srv-deliverable-text">{d}</span>
                </li>
              ))}
            </ul>
            <div className="srv-cta-wrap" ref={ctaWrapRef}>
              <a href="/#contact" className="hero-cta">{ctaLabel}</a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
