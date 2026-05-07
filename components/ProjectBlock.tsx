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
  category: string;
  client: string;
  description: string;
  outcomes: string[];
  ctaLabel: string;
  href: string;
}

export function ProjectBlock({
  momentText,
  number,
  name,
  category,
  client,
  description,
  outcomes,
  ctaLabel,
  href,
}: Props) {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const momentRef   = useRef<HTMLDivElement>(null);
  const contentRef  = useRef<HTMLDivElement>(null);
  const ghostRef    = useRef<HTMLSpanElement>(null);
  const numTagRef   = useRef<HTMLSpanElement>(null);
  const imageRef    = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLSpanElement>(null);
  const nameRef     = useRef<HTMLHeadingElement>(null);
  const clientRef   = useRef<HTMLParagraphElement>(null);
  const descRef     = useRef<HTMLParagraphElement>(null);
  const outcomesRef = useRef<HTMLUListElement>(null);
  const ctaWrapRef  = useRef<HTMLDivElement>(null);

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

          gsap.fromTo(imageRef.current,
            { opacity: 0, scale: 1.04 },
            { opacity: 1, scale: 1, duration: 0.8, ease, ...trigger(imageRef.current) });

          gsap.fromTo(categoryRef.current,
            { opacity: 0, x: -20 },
            { opacity: 1, x: 0, duration: 0.6, ease, ...trigger(categoryRef.current) });

          const nChars = Array.from(nameRef.current?.querySelectorAll('.char') ?? []);
          gsap.fromTo(nChars,
            { opacity: 0, filter: 'blur(10px)' },
            { opacity: 1, filter: 'blur(0px)', stagger: 0.03, duration: 0.6, ease, ...trigger(nameRef.current) });

          gsap.fromTo(clientRef.current,
            { opacity: 0, x: -20 },
            { opacity: 1, x: 0, duration: 0.6, ease, ...trigger(clientRef.current) });

          gsap.fromTo(descRef.current,
            { opacity: 0, x: -20 },
            { opacity: 1, x: 0, duration: 0.8, ease, ...trigger(descRef.current) });

          const items = Array.from(outcomesRef.current?.querySelectorAll('.prj-outcome') ?? []);
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

          // ── Moment enters ───────────────────────────────────────────────
          const mChars = Array.from(momentRef.current?.querySelectorAll('.char') ?? []);
          tl.fromTo(momentRef.current, { opacity: 0 }, { opacity: 1, duration: 0.1 });
          tl.fromTo(mChars,
            { opacity: 0, filter: 'blur(12px)' },
            { opacity: 1, filter: 'blur(0px)', stagger: 0.06, duration: 0.8, ease },
            '<+0.05');

          tl.to({}, { duration: 2 });

          // ── Moment exits ────────────────────────────────────────────────
          tl.to(mChars,
            { opacity: 0, filter: 'blur(12px)', stagger: 0.05, duration: 0.6, ease: 'power2.in' });
          tl.to(momentRef.current, { opacity: 0, duration: 0.3 }, '>-0.1');

          tl.to({}, { duration: 0.6 });

          // ── Content reveals ─────────────────────────────────────────────
          tl.set(contentRef.current, { opacity: 1 });

          tl.fromTo(ghostRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.8, ease });

          tl.fromTo(numTagRef.current,
            { opacity: 0, x: -28 },
            { opacity: 1, x: 0, duration: 0.6, ease },
            '<+0.3');

          tl.fromTo(imageRef.current,
            { opacity: 0, scale: 1.06 },
            { opacity: 1, scale: 1, duration: 1, ease },
            '<+0.2');

          tl.fromTo(categoryRef.current,
            { opacity: 0, x: 28 },
            { opacity: 1, x: 0, duration: 0.6, ease },
            '<');

          const nChars = Array.from(nameRef.current?.querySelectorAll('.char') ?? []);
          tl.fromTo(nChars,
            { opacity: 0, filter: 'blur(10px)' },
            { opacity: 1, filter: 'blur(0px)', stagger: 0.04, duration: 0.7, ease },
            '>+0.1');

          tl.fromTo(clientRef.current,
            { opacity: 0, x: 28 },
            { opacity: 1, x: 0, duration: 0.6, ease },
            '>+0.1');

          tl.fromTo(descRef.current,
            { opacity: 0, x: 28 },
            { opacity: 1, x: 0, duration: 1, ease },
            '>+0.2');

          const items = Array.from(outcomesRef.current?.querySelectorAll('.prj-outcome') ?? []);
          tl.fromTo(items,
            { opacity: 0, x: 20 },
            { opacity: 1, x: 0, stagger: 0.1, duration: 0.6, ease },
            '>+0.2');

          tl.fromTo(ctaWrapRef.current,
            { opacity: 0, x: 28 },
            { opacity: 1, x: 0, duration: 0.8, ease },
            '>+0.3');

          // ── Hold ────────────────────────────────────────────────────────
          tl.to({}, { duration: 2 });

          // ── Exit ────────────────────────────────────────────────────────
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
    <div className="prj-section" ref={sectionRef}>
      <div className="prj-sticky">

        {/* Moment */}
        <div className="prj-moment" ref={momentRef}>
          <p className="prj-moment-text">{chars(momentText)}</p>
        </div>

        {/* Content */}
        <div className="prj-content" ref={contentRef}>
          <span className="prj-ghost-num" ref={ghostRef}>{number}</span>

          {/* Left — image */}
          <div className="prj-left">
            <span className="prj-num-tag" ref={numTagRef}>{number}</span>
            <div className="prj-image-wrap" ref={imageRef}>
              <span className="prj-image-label">Project Visual</span>
            </div>
          </div>

          {/* Right — details */}
          <div className="prj-right">
            <span className="prj-category" ref={categoryRef}>{category}</span>
            <h2 className="prj-name" ref={nameRef}>{chars(name)}</h2>
            <p className="prj-client" ref={clientRef}>{client}</p>
            <p className="prj-description" ref={descRef}>{description}</p>
            <ul className="prj-outcomes" ref={outcomesRef}>
              {outcomes.map((o, i) => (
                <li key={i} className="prj-outcome">
                  <span className="prj-outcome-dash" />
                  <span className="prj-outcome-text">{o}</span>
                </li>
              ))}
            </ul>
            <div className="prj-cta-wrap" ref={ctaWrapRef}>
              <a href={href} className="hero-cta">{ctaLabel}</a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
