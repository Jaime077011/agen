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
  { number: '07', category: 'Brand Identity' },
  { number: '08', category: 'Web & Store' },
  { number: '09', category: 'AI Systems' },
  { number: '10', category: 'Brand Identity' },
  { number: '11', category: 'Web & Store' },
  { number: '12', category: 'AI Systems' },
];

const N = PROJECTS.length;

export function ProjectsSection() {
  const sectionRef    = useRef<HTMLDivElement>(null);
  const headerRef     = useRef<HTMLDivElement>(null);
  const headlineRef   = useRef<HTMLHeadingElement>(null);
  const sceneRef      = useRef<HTMLDivElement>(null);
  const momentAreaRef = useRef<HTMLDivElement>(null);
  const momentRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isCancelled = false;
    let ctx: { revert: () => void } | null = null;

    const scene = sceneRef.current;
    const a3dEl = scene?.querySelector('.ps-a3d') as HTMLElement | null;

    // ── Ambient drone ──────────────────────────────────────────────────────
    let audioCtx: AudioContext | null = null;
    let gainNode: GainNode | null = null;
    let sectionInView = false;
    let isHovered = false;

    const rampGain = (target: number, dur = 0.8) => {
      if (!gainNode || !audioCtx) return;
      const t = audioCtx.currentTime;
      gainNode.gain.cancelScheduledValues(t);
      gainNode.gain.setValueAtTime(gainNode.gain.value, t);
      gainNode.gain.linearRampToValueAtTime(target, t + dur);
    };

    const buildAudio = () => {
      if (audioCtx) return;
      try {
        audioCtx = new AudioContext();
        gainNode = audioCtx.createGain();
        gainNode.gain.value = 0;

        // Warm low-pass filter
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 900;
        filter.Q.value = 0.7;
        gainNode.connect(filter);
        filter.connect(audioCtx.destination);

        // Musical chord: A2 · E3 · A3 · E4
        const notes = [
          { freq: 110,    vol: 0.38 },
          { freq: 165,    vol: 0.28 },
          { freq: 220,    vol: 0.22 },
          { freq: 329.63, vol: 0.12 },
        ];

        notes.forEach(({ freq, vol }, i) => {
          const osc  = audioCtx!.createOscillator();
          const gain = audioCtx!.createGain();

          // Slow per-harmonic vibrato — gives it life
          const lfo     = audioCtx!.createOscillator();
          const lfoAmt  = audioCtx!.createGain();
          lfo.frequency.value  = 0.17 + i * 0.055;
          lfoAmt.gain.value    = freq * 0.0028;
          lfo.connect(lfoAmt);
          lfoAmt.connect(osc.frequency);
          lfo.start();

          osc.type          = 'sine';
          osc.frequency.value = freq;
          gain.gain.value   = vol;
          osc.connect(gain);
          gain.connect(gainNode!);
          osc.start();
        });

        if (sectionInView && !isHovered) rampGain(0.14);
      } catch {}
    };

    const onSceneEnter = () => {
      isHovered = true;
      rampGain(0, 0.35);
      if (a3dEl) a3dEl.style.animationPlayState = 'paused';
    };
    const onSceneLeave = () => {
      isHovered = false;
      if (sectionInView) rampGain(0.14);
      if (a3dEl) a3dEl.style.animationPlayState = '';
    };

    scene?.addEventListener('mouseenter', onSceneEnter);
    scene?.addEventListener('mouseleave', onSceneLeave);

    const initAudio = () => { buildAudio(); window.removeEventListener('pointerdown', initAudio); };
    window.addEventListener('pointerdown', initAudio);

    (async () => {
      const { default: gsap } = await import('gsap');
      const { ScrollTrigger }  = await import('gsap/ScrollTrigger');
      if (isCancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const dispatchNoiseMode = (mode: number) =>
          window.dispatchEvent(new CustomEvent('noise-mode', { detail: mode }));

        // ── Card-by-card intro / exit ──────────────────────────────────────
        // We only animate opacity — transform is owned by the CSS spin animation
        // and cannot be touched by GSAP without breaking it.
        const cards   = Array.from(sectionRef.current?.querySelectorAll('.ps-card') ?? []);
        const hChars  = Array.from(headlineRef.current?.querySelectorAll('.char') ?? []);
        const descEl  = headerRef.current?.querySelector('.ps-desc');
        const ctaEl   = headerRef.current?.querySelector('.hero-cta');
        const support = [descEl, ctaEl].filter(Boolean);

        gsap.set(cards, { opacity: 0 });
        gsap.set(headerRef.current, { opacity: 1 });
        gsap.set(hChars, { opacity: 0, filter: 'blur(12px)' });
        gsap.set(support, { opacity: 0 });

        const blurIn  = () => gsap.fromTo(hChars,
          { opacity: 0, filter: 'blur(12px)' },
          { opacity: 1, filter: 'blur(0px)', stagger: 0.07, duration: 0.8, ease: 'power2.out' });
        const blurOut = () => gsap.to(hChars,
          { opacity: 0, filter: 'blur(12px)', stagger: 0.05, duration: 0.55, ease: 'power2.in' });

        // Intro: cards materialise right-to-left (index N-1 → 0)
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top 80%',
          onEnter: () => {
            blurIn();
            gsap.to(support, { opacity: 1, duration: 0.7, ease: 'power2.out', delay: 0.5 });
            gsap.to(cards, { opacity: 1, stagger: { amount: 1.6, from: 'end' }, duration: 0.75, ease: 'power2.out', delay: 0.2 });
            dispatchNoiseMode(1);
            sectionInView = true;
            if (!isHovered) rampGain(0.14);
          },
          onLeaveBack: () => {
            blurOut();
            gsap.to(support, { opacity: 0, duration: 0.3 });
            gsap.to(cards, { opacity: 0, stagger: { amount: 0.8, from: 'start' }, duration: 0.5, ease: 'power2.in' });
            dispatchNoiseMode(0);
            sectionInView = false;
            rampGain(0);
          },
        });

        // Exit: cards fade out left-to-right as section leaves
        ScrollTrigger.create({
          trigger: sceneRef.current,
          start: 'bottom 35%',
          onLeave: () => {
            blurOut();
            gsap.to(support, { opacity: 0, duration: 0.3 });
            gsap.to(cards, { opacity: 0, stagger: { amount: 0.9, from: 'start' }, duration: 0.55, ease: 'power2.in' });
            sectionInView = false;
            rampGain(0);
          },
          onEnterBack: () => {
            blurIn();
            gsap.to(support, { opacity: 1, duration: 0.7, ease: 'power2.out' });
            gsap.to(cards, { opacity: 1, stagger: { amount: 1.2, from: 'end' }, duration: 0.75, ease: 'power2.out' });
            sectionInView = true;
            if (!isHovered) rampGain(0.14);
          },
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
      scene?.removeEventListener('mouseenter', onSceneEnter);
      scene?.removeEventListener('mouseleave', onSceneLeave);
      window.removeEventListener('pointerdown', initAudio);
      isCancelled = true;
      ctx?.revert();
      audioCtx?.close();
    };
  }, []);

  return (
    <div className="ps-section" ref={sectionRef}>

      {/* Header + carousel — one screen */}
      <div className="ps-main">
        <div className="ps-header" ref={headerRef}>
          <div className="ps-header-left">
            <h2 className="ps-headline" ref={headlineRef}>{wordChars('The work.', 'ps-h')}</h2>
            <p className="ps-desc">12 projects. Brand identity, digital storefronts, and AI systems.</p>
          </div>
          <a href="/projects" className="hero-cta">See all projects</a>
        </div>

        {/* 3D carousel */}
        <div className="ps-scene" ref={sceneRef}>
          <div
            className="ps-a3d"
            style={{ '--n': N } as React.CSSProperties}
          >
            {PROJECTS.map((p, i) => (
              <div
                key={i}
                className="ps-card"
                style={{ '--i': i } as React.CSSProperties}
              >
                <div className="ps-card-img" />
                <div className="ps-card-overlay">
                  <span className="ps-overlay-num">#{p.number}</span>
                  <span className="ps-overlay-cat">{p.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Moment */}
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
