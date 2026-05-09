'use client';
import { useEffect, useRef } from 'react';

function wordChars(text: string, prefix: string) {
  return text.split(' ').map((word, wi) => (
    <span key={`${prefix}-w${wi}`} className="word-line">
      {word.split('').map((c, ci) => (
        <span key={`${prefix}-${wi}-${ci}`} className="char">{c}</span>
      ))}
    </span>
  ));
}

const PROJECTS = [
  { number: '01', category: 'Brand Identity' },
  { number: '02', category: 'Web & Store' },
  { number: '03', category: 'AI Systems' },
  { number: '04', category: 'Brand Identity' },
  { number: '05', category: 'Web & Store' },
  { number: '06', category: 'AI Systems' },
];

export function ProjectsSection() {
  const sectionRef    = useRef<HTMLDivElement>(null);
  const carouselRef   = useRef<HTMLDivElement>(null);
  const momentAreaRef = useRef<HTMLDivElement>(null);
  const momentRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isCancelled = false;
    let ctx: { revert: () => void } | null = null;

    // ── Drag-to-scroll (desktop) ──
    const carousel = carouselRef.current;
    let cleanupDrag = () => {};

    if (carousel) {
      let isDown = false;
      let startX = 0;
      let scrollLeft = 0;

      const onDown  = (e: MouseEvent) => {
        isDown = true;
        carousel.classList.add('is-dragging');
        startX = e.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
      };
      const onLeave = () => { isDown = false; carousel.classList.remove('is-dragging'); };
      const onUp    = () => { isDown = false; carousel.classList.remove('is-dragging'); };
      const onMove  = (e: MouseEvent) => {
        if (!isDown) return;
        e.preventDefault();
        carousel.scrollLeft = scrollLeft - (e.pageX - carousel.offsetLeft - startX) * 1.4;
      };

      carousel.addEventListener('mousedown', onDown);
      carousel.addEventListener('mouseleave', onLeave);
      carousel.addEventListener('mouseup', onUp);
      carousel.addEventListener('mousemove', onMove);

      cleanupDrag = () => {
        carousel.removeEventListener('mousedown', onDown);
        carousel.removeEventListener('mouseleave', onLeave);
        carousel.removeEventListener('mouseup', onUp);
        carousel.removeEventListener('mousemove', onMove);
      };
    }

    // ── GSAP ──
    (async () => {
      const { default: gsap } = await import('gsap');
      const { ScrollTrigger }  = await import('gsap/ScrollTrigger');
      if (isCancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const dispatchNoiseMode = (mode: number) =>
          window.dispatchEvent(new CustomEvent('noise-mode', { detail: mode }));

        // Carousel fade-in
        gsap.set(carouselRef.current, { opacity: 0, y: 60 });
        ScrollTrigger.create({
          trigger: carouselRef.current,
          start: 'top 90%',
          onEnter: () => gsap.to(carouselRef.current, {
            opacity: 1, y: 0, duration: 1.1, ease: 'power2.out',
          }),
          onLeaveBack: () => gsap.set(carouselRef.current, { opacity: 0, y: 60 }),
        });

        // Moment
        const mChars = Array.from(momentRef.current?.querySelectorAll('.char') ?? []);

        const momentTl = gsap.timeline({
          scrollTrigger: {
            trigger: momentAreaRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
          },
        });

        momentTl.fromTo(momentRef.current, { opacity: 0 }, { opacity: 1, duration: 0.1,
          onStart: () => dispatchNoiseMode(1),
          onReverseComplete: () => dispatchNoiseMode(0) }, '>+0.2');
        momentTl.fromTo(mChars,
          { opacity: 0, filter: 'blur(12px)' },
          { opacity: 1, filter: 'blur(0px)', stagger: 0.07, duration: 0.8, ease: 'power2.out' },
          '<+0.05');
        momentTl.to({}, { duration: 2.5 });
        momentTl.to(mChars,
          { opacity: 0, filter: 'blur(12px)', stagger: 0.07, duration: 0.8, ease: 'power2.in',
            onStart: () => dispatchNoiseMode(0),
            onReverseComplete: () => dispatchNoiseMode(1) });
        momentTl.to(momentRef.current, { opacity: 0, duration: 0.3 }, '>-0.1');

      }, sectionRef);
    })();

    return () => {
      cleanupDrag();
      isCancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <div className="ps-section" ref={sectionRef}>

      <div className="ps-carousel" ref={carouselRef}>
        {PROJECTS.map((p, i) => (
          <div key={i} className="ps-carousel-card">
            <div className="ps-carousel-img" />
            <div className="ps-carousel-overlay">
              <span className="ps-overlay-num">#{p.number}</span>
              <span className="ps-overlay-cat">{p.category}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="ps-moment-area" ref={momentAreaRef}>
        <div className="ps-moment-sticky">
          <div className="ps-moment" ref={momentRef}>
            <p className="ps-moment-text">{wordChars('Hear from our clients.', 'ps-m')}</p>
          </div>
        </div>
      </div>

    </div>
  );
}
