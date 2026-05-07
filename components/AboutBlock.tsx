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
  title: string;
  tagline: string;
  paragraphs: string[];
  highlight: string;
}

export function AboutBlock({
  momentText,
  number,
  title,
  tagline,
  paragraphs,
  highlight,
}: Props) {
  const sectionRef   = useRef<HTMLDivElement>(null);
  const momentRef    = useRef<HTMLDivElement>(null);
  const contentRef   = useRef<HTMLDivElement>(null);
  const ghostRef     = useRef<HTMLSpanElement>(null);
  const numTagRef    = useRef<HTMLSpanElement>(null);
  const titleRef     = useRef<HTMLHeadingElement>(null);
  const taglineRef   = useRef<HTMLParagraphElement>(null);
  const bodyRef      = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

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

          const tChars = Array.from(titleRef.current?.querySelectorAll('.char') ?? []);
          gsap.fromTo(tChars,
            { opacity: 0, filter: 'blur(10px)' },
            { opacity: 1, filter: 'blur(0px)', stagger: 0.03, duration: 0.6, ease, ...trigger(titleRef.current) });

          gsap.fromTo(taglineRef.current,
            { opacity: 0, x: -20 },
            { opacity: 1, x: 0, duration: 0.6, ease, ...trigger(taglineRef.current) });

          const paras = Array.from(bodyRef.current?.querySelectorAll('.abt-para') ?? []);
          paras.forEach(p => {
            gsap.fromTo(p,
              { opacity: 0, y: 16 },
              { opacity: 1, y: 0, duration: 0.7, ease, ...trigger(p) });
          });

          gsap.fromTo(highlightRef.current,
            { opacity: 0, x: -20 },
            { opacity: 1, x: 0, duration: 0.8, ease, ...trigger(highlightRef.current) });

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

          const tChars = Array.from(titleRef.current?.querySelectorAll('.char') ?? []);
          tl.fromTo(tChars,
            { opacity: 0, filter: 'blur(10px)' },
            { opacity: 1, filter: 'blur(0px)', stagger: 0.04, duration: 0.7, ease },
            '<+0.2');

          tl.fromTo(taglineRef.current,
            { opacity: 0, x: -28 },
            { opacity: 1, x: 0, duration: 0.7, ease },
            '>+0.2');

          const paras = Array.from(bodyRef.current?.querySelectorAll('.abt-para') ?? []);
          tl.fromTo(paras,
            { opacity: 0, x: 28 },
            { opacity: 1, x: 0, stagger: 0.2, duration: 0.9, ease },
            '<');

          tl.fromTo(highlightRef.current,
            { opacity: 0, x: 28 },
            { opacity: 1, x: 0, duration: 0.9, ease },
            '>+0.2');

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
    <div className="abt-section" ref={sectionRef}>
      <div className="abt-sticky">

        {/* Moment */}
        <div className="abt-moment" ref={momentRef}>
          <p className="abt-moment-text">{chars(momentText)}</p>
        </div>

        {/* Content */}
        <div className="abt-content" ref={contentRef}>
          <span className="abt-ghost-word" ref={ghostRef}>{title}</span>

          {/* Left */}
          <div className="abt-left">
            <span className="abt-num-tag" ref={numTagRef}>{number}</span>
            <h2 className="abt-title" ref={titleRef}>{chars(title)}</h2>
            <p className="abt-tagline" ref={taglineRef}>{tagline}</p>
          </div>

          {/* Right */}
          <div className="abt-right">
            <div className="abt-body" ref={bodyRef}>
              {paragraphs.map((p, i) => (
                <p key={i} className="abt-para">{p}</p>
              ))}
            </div>
            <div className="abt-highlight" ref={highlightRef}>
              <p className="abt-highlight-text">&ldquo;{highlight}&rdquo;</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
