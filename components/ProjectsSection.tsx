'use client';
import { useEffect, useRef } from 'react';

function chars(text: string) {
  return text.split('').map((c, i) => (
    <span key={i} className="char">{c}</span>
  ));
}

function wordChars(text: string, prefix: string) {
  const words = text.split(' ');
  return words.map((word, wi) => (
    <span key={`${prefix}-w${wi}`} className="word-line">
      {word.split('').map((c, ci) => (
        <span key={`${prefix}-${wi}-${ci}`} className="char">{c}</span>
      ))}
    </span>
  ));
}

const PROJECTS = [
  {
    number: '01',
    category: 'Brand Identity',
    title: 'Project Name One',
    description: 'A short description of what we built for this client and the results they achieved working with The Archetypers.',
    cta: 'View project',
    href: '#',
  },
  {
    number: '02',
    category: 'Web & Store',
    title: 'Project Name Two',
    description: 'A short description of what we built for this client and the results they achieved working with The Archetypers.',
    cta: 'View project',
    href: '#',
  },
  {
    number: '03',
    category: 'AI Systems',
    title: 'Project Name Three',
    description: 'A short description of what we built for this client and the results they achieved working with The Archetypers.',
    cta: 'View project',
    href: '#',
  },
];

export function ProjectsSection() {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const stickyRef   = useRef<HTMLDivElement>(null);
  const card1Ref    = useRef<HTMLDivElement>(null);
  const card2Ref    = useRef<HTMLDivElement>(null);
  const card3Ref    = useRef<HTMLDivElement>(null);
  const momentRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isCancelled = false;
    let ctx: { revert: () => void } | null = null;

    (async () => {
      const { default: gsap } = await import('gsap');
      const { ScrollTrigger }  = await import('gsap/ScrollTrigger');
      if (isCancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const cards = [card1Ref.current, card2Ref.current, card3Ref.current];

        const getTextEls = (card: Element | null) => {
          if (!card) return [];
          return [
            card.querySelector('.ps-card-category'),
            card.querySelector('.ps-card-title'),
            card.querySelector('.ps-card-description'),
            card.querySelector('.ps-card-cta'),
          ].filter(Boolean) as Element[];
        };

        // Cards start off-screen below; text starts hidden
        gsap.set(cards, { yPercent: 100 });
        cards.forEach(card => gsap.set(getTextEls(card), { opacity: 0, y: 24 }));

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
          },
        });

        cards.forEach((card, i) => {
          if (i === 0) {
            tl.to(card, { yPercent: 0, duration: 1.6, ease: 'power2.inOut' });
            tl.to(getTextEls(card), { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.1 }, '>-0.1');
          }
          // Hold
          tl.to({}, { duration: 0.7 });
          // Exit upward
          tl.to(card, { yPercent: -100, opacity: 0, duration: 1.6, ease: 'power2.inOut' });
          // Next card enters simultaneously, then its text slides in
          if (i < cards.length - 1) {
            tl.to(cards[i + 1], { yPercent: 0, duration: 1.6, ease: 'power2.inOut' }, '<');
            tl.to(getTextEls(cards[i + 1]), { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.1 }, '>-0.1');
          }
        });

        // CTA moment — matches SiteSection moment style
        const mChars = Array.from(momentRef.current?.querySelectorAll('.char') ?? []);

        const dispatchNoiseMode = (mode: number) =>
          window.dispatchEvent(new CustomEvent('noise-mode', { detail: mode }));

        tl.fromTo(momentRef.current, { opacity: 0 }, { opacity: 1, duration: 0.1,
          onStart: () => dispatchNoiseMode(1),
          onReverseComplete: () => dispatchNoiseMode(0) }, '>+0.2');
        tl.fromTo(mChars,
          { opacity: 0, filter: 'blur(12px)' },
          { opacity: 1, filter: 'blur(0px)', stagger: 0.07, duration: 0.8, ease: 'power2.out' },
          '<+0.05');

        // Hold
        tl.to({}, { duration: 2.5 });

        // Exit — chars blur out fully, then wrapper fades
        tl.to(mChars,
          { opacity: 0, filter: 'blur(12px)', stagger: 0.07, duration: 0.8, ease: 'power2.in',
            onStart: () => dispatchNoiseMode(0),
            onReverseComplete: () => dispatchNoiseMode(1) });
        tl.to(momentRef.current, { opacity: 0, duration: 0.3 }, '>-0.1');

      }, sectionRef);
    })();

    return () => {
      isCancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <div className="ps-section" ref={sectionRef}>
      <div className="ps-sticky" ref={stickyRef}>

        {/* Card 1 */}
        <div className="ps-card-layer" ref={card1Ref}>
          <ProjectCard {...PROJECTS[0]} />
        </div>

        {/* Card 2 */}
        <div className="ps-card-layer" ref={card2Ref}>
          <ProjectCard {...PROJECTS[1]} />
        </div>

        {/* Card 3 */}
        <div className="ps-card-layer" ref={card3Ref}>
          <ProjectCard {...PROJECTS[2]} />
        </div>

        {/* CTA moment */}
        <div className="ps-moment" ref={momentRef}>
          <p className="ps-moment-text">{wordChars('Hear from our clients.', 'ps-m')}</p>
        </div>

      </div>
    </div>
  );
}

function ProjectCard({ category, title, description, cta, href }: Omit<typeof PROJECTS[0], 'number'>) {
  return (
    <div className="ps-card">
      {/* Image side */}
      <div className="ps-card-image">
        <div className="ps-card-image-placeholder" />
      </div>

      {/* Content side */}
      <div className="ps-card-content">
        <span className="ps-card-category">{category}</span>
        <h3 className="ps-card-title">{title}</h3>
        <p className="ps-card-description">{description}</p>
        <a href={href} className="hero-cta ps-card-cta">{cta}</a>
      </div>
    </div>
  );
}
