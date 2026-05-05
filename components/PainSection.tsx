'use client';
import { useEffect, useRef } from 'react';
import { useLang } from '@/lib/lang-context';

const PAIN_PHASES = [
  { threshold: 0.20, cls: 'phase-truth-1' },
  { threshold: 0.38, cls: 'phase-truth-2' },
  { threshold: 0.56, cls: 'phase-truth-3' },
  { threshold: 0.70, cls: 'phase-pivot'   },
  { threshold: 0.84, cls: 'phase-cta'     },
];

export function PainSection() {
  const { t } = useLang();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function updatePhases() {
      const wrapper = wrapperRef.current;
      const section = sectionRef.current;
      if (!wrapper || !section || window.innerWidth <= 768) return;
      const rect = wrapper.getBoundingClientRect();
      const total = wrapper.offsetHeight - window.innerHeight;
      const p = Math.max(0, Math.min(1, -rect.top / total));
      section.style.setProperty('--hook-p', Math.min(1, p / 0.18).toFixed(3));
      PAIN_PHASES.forEach(({ threshold, cls }) => {
        section.classList.toggle(cls, p >= threshold);
      });
    }

    window.addEventListener('scroll', updatePhases, { passive: true });
    return () => window.removeEventListener('scroll', updatePhases);
  }, []);

  return (
    <div className="pain-scroll-wrapper" ref={wrapperRef}>
      <section className="pain-section" ref={sectionRef}>
        <div className="pain-inner">
          <p className="pain-hook">{t.painHook}</p>
          <div className="pain-truths-col">
            <p className="pain-truth">{t.painTruth1}</p>
            <p className="pain-truth">{t.painTruth2}</p>
            <p className="pain-truth">{t.painTruth3}</p>
          </div>
        </div>
        <hr className="pain-divider" />
        <div className="pain-pivot-wrap">
          <p className="pain-pivot">{t.painPivot}</p>
        </div>
        <div className="pain-cta-wrap">
          <a href="#" className="pain-link">{t.painCta}</a>
        </div>
      </section>
    </div>
  );
}
