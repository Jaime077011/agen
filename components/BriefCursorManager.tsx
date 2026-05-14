'use client';
import { useState, useEffect, useRef } from 'react';
import { useLang } from '@/lib/lang-context';

type CursorType = 'service' | 'next' | 'back' | 'plus' | 'minus' | 'input' | 'drag' | null;

const ICONS: Record<Exclude<CursorType, null>, React.ReactNode> = {
  service: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  next: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  back: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  ),
  plus: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  minus: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  input: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </svg>
  ),
  drag: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 8 21 12 17 16"/>
      <polyline points="7 8 3 12 7 16"/>
      <line x1="3" y1="12" x2="21" y2="12"/>
    </svg>
  ),
};

export function BriefCursorManager() {
  const { lang } = useLang();
  const isAr = lang === 'ar-eg' || lang === 'ar-sa';
  const [hovered, setHovered] = useState<CursorType>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const rafRef    = useRef<number>(0);
  const posRef    = useRef({ x: 0, y: 0, cx: 0, cy: 0 });

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const mainEl = document.querySelector('.brief-main');
    if (!mainEl) return;

    const dot  = document.getElementById('cursor-dot')  as HTMLElement | null;
    const ring = document.getElementById('cursor-ring') as HTMLElement | null;
    const link = document.getElementById('cursor-link') as HTMLElement | null;

    function hideSiblings() {
      dot?.style.setProperty('opacity', '0');
      ring?.style.setProperty('opacity', '0');
      link?.classList.remove('active');
    }
    function showSiblings() {
      dot?.style.removeProperty('opacity');
      ring?.style.removeProperty('opacity');
    }

    function onMove(e: MouseEvent) {
      posRef.current.x = e.clientX;
      posRef.current.y = e.clientY;
    }

    function onOver(e: MouseEvent) {
      e.stopPropagation();
      const t = e.target as Element;

      if (t.closest('.ctf2-service-card')) {
        setHovered('service'); hideSiblings();
      } else if (t.closest('.ctf2-back')) {
        setHovered('back'); hideSiblings();
      } else if (t.closest('.ctf2-slider')) {
        setHovered('drag'); hideSiblings();
      } else if (t.closest('.ctf2-budget-btn')) {
        const isPlus = t.closest('.ctf2-budget-btn')?.getAttribute('aria-label') === 'Increase';
        setHovered(isPlus ? 'plus' : 'minus'); hideSiblings();
      } else if (t.closest('.ctf2-billing-btn')) {
        setHovered('next'); hideSiblings();
      } else if (t.closest('.ctf2-input') || t.closest('.ctf2-textarea')) {
        setHovered('input'); hideSiblings();
      } else {
        const nextBtn = t.closest('.ctf2-next') as HTMLButtonElement | null;
        if (nextBtn && !nextBtn.disabled) {
          setHovered('next'); hideSiblings();
        } else {
          setHovered(null); showSiblings();
        }
      }
    }

    function onLeave() {
      setHovered(null);
      showSiblings();
    }

    function tick() {
      const { x, y, cx, cy } = posRef.current;
      const nx = cx + (x - cx) * 0.18;
      const ny = cy + (y - cy) * 0.18;
      posRef.current.cx = nx;
      posRef.current.cy = ny;
      if (cursorRef.current) {
        cursorRef.current.style.left = nx + 'px';
        cursorRef.current.style.top  = ny + 'px';
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);

    window.addEventListener('mousemove', onMove);
    mainEl.addEventListener('mouseover', onOver as EventListener);
    mainEl.addEventListener('mouseleave', onLeave);

    return () => {
      mainEl.removeEventListener('mouseover', onOver as EventListener);
      mainEl.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
      showSiblings();
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className={`brief-cursor${hovered ? ' active' : ''}${hovered === 'service' ? ' large' : ''}`}
      aria-hidden="true"
    >
      {hovered && ICONS[
        isAr && hovered === 'next' ? 'back' :
        isAr && hovered === 'back' ? 'next' :
        hovered
      ]}
    </div>
  );
}
