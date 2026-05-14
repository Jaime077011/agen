'use client';
import { useState, useEffect, useRef } from 'react';
import { useLang } from '@/lib/lang-context';
import { getConsent, setConsent } from '@/lib/consent';
import { unlockAudioSync, initAudio } from '@/lib/sounds';

const PRESETS = [
  '#c41230',
  '#e85d04',
  '#f59e0b',
  '#10b981',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#e2e8f0',
];

function hexToRgb(hex: string) {
  const n = parseInt(hex.replace('#', ''), 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

function applyAccent(hex: string) {
  document.documentElement.style.setProperty('--accent', hex);
  document.documentElement.style.setProperty('--accent-rgb', hexToRgb(hex));
  window.dispatchEvent(new CustomEvent('accent-change', { detail: hex }));
  try { localStorage.setItem('accent', hex); } catch { /* */ }
}

export function ControlPanel() {
  const { lang, toggleLang } = useLang();
  const [open, setOpen]           = useState(false);
  const [colorOpen, setColorOpen] = useState(false);
  const [accent, setAccent]       = useState('#c41230');
  const [soundOn, setSoundOn]     = useState(true);

  const panelRef      = useRef<HTMLDivElement>(null);
  const toggleBtnRef  = useRef<HTMLButtonElement>(null);
  const didDragRef    = useRef(false);
  const isDraggingRef = useRef(false);
  const dragStartRef  = useRef({ x: 0, y: 0 });
  const panelStartRef = useRef({ x: 0, y: 0 });

  // Load saved accent and sound preference on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('accent');
      if (saved) { applyAccent(saved); setAccent(saved); }
    } catch { /* */ }
    const consent = getConsent();
    if (consent) setSoundOn(consent.sound !== false);
  }, []);

  async function toggleSound() {
    const next = !soundOn;
    setSoundOn(next);
    const consent = getConsent();
    setConsent({ cookies: consent?.cookies ?? true, sound: next });
    if (next) { unlockAudioSync(); await initAudio(); }
  }

  // Drag-to-reposition
  useEffect(() => {
    const panel     = panelRef.current;
    const toggleBtn = toggleBtnRef.current;
    if (!panel || !toggleBtn) return;

    function startDrag(e: MouseEvent | TouchEvent) {
      const touch = 'touches' in e ? e.touches[0] : e;
      dragStartRef.current  = { x: touch.clientX, y: touch.clientY };
      const rect = panel!.getBoundingClientRect();
      panelStartRef.current = { x: rect.left, y: rect.top };
      isDraggingRef.current = true;
      didDragRef.current    = false;
      panel!.style.right     = 'auto';
      panel!.style.bottom    = 'auto';
      panel!.style.transform = 'none';
      panel!.style.left      = rect.left + 'px';
      panel!.style.top       = rect.top  + 'px';
    }

    function onDrag(e: MouseEvent | TouchEvent) {
      if (!isDraggingRef.current) return;
      const touch = 'touches' in e ? e.touches[0] : e;
      const dx = touch.clientX - dragStartRef.current.x;
      const dy = touch.clientY - dragStartRef.current.y;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) didDragRef.current = true;
      if (!didDragRef.current) return;
      panel!.style.left = (panelStartRef.current.x + dx) + 'px';
      panel!.style.top  = (panelStartRef.current.y + dy) + 'px';
    }

    function stopDrag() { isDraggingRef.current = false; }

    toggleBtn.addEventListener('mousedown', startDrag);
    toggleBtn.addEventListener('touchstart', startDrag as EventListener, { passive: true });
    document.addEventListener('mousemove', onDrag as EventListener);
    document.addEventListener('touchmove', onDrag as EventListener, { passive: true });
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchend', stopDrag);

    return () => {
      toggleBtn.removeEventListener('mousedown', startDrag);
      toggleBtn.removeEventListener('touchstart', startDrag as EventListener);
      document.removeEventListener('mousemove', onDrag as EventListener);
      document.removeEventListener('touchmove', onDrag as EventListener);
      document.removeEventListener('mouseup', stopDrag);
      document.removeEventListener('touchend', stopDrag);
    };
  }, []);

  function handleToggleClick() {
    if (didDragRef.current) return;
    setOpen(o => !o);
    setColorOpen(false);
  }

  function handleAccent(hex: string) {
    applyAccent(hex);
    setAccent(hex);
  }

  return (
    <div
      ref={panelRef}
      className={`control-panel anim-fade${open ? ' open' : ''}`}
      style={{ '--delay': '900ms' } as React.CSSProperties}
    >
      {/* Color panel popup */}
      <div className={`color-panel${colorOpen ? ' open' : ''}`}>
        <span className="color-panel-label">Accent colour</span>
        <div className="color-swatches">
          {PRESETS.map(hex => (
            <button
              key={hex}
              className={`color-swatch${accent.toLowerCase() === hex.toLowerCase() ? ' active' : ''}`}
              style={{ background: hex }}
              onClick={() => handleAccent(hex)}
              aria-label={hex}
            />
          ))}
        </div>
        <div className="color-custom">
          <span className="color-custom-label">Custom</span>
          <input
            type="color"
            className="color-custom-input"
            value={accent}
            onChange={e => handleAccent(e.target.value)}
            aria-label="Custom colour"
          />
        </div>
      </div>

      {/* Arc item 1 — language toggle */}
      <button className="arc-item" onClick={toggleLang} aria-label="Switch language">
        {lang === 'en' ? 'EG' : lang === 'ar-eg' ? 'SA' : 'EN'}
      </button>

      {/* Arc item 2 — colour picker */}
      <button
        className="arc-item"
        onClick={() => setColorOpen(o => !o)}
        aria-label="Change accent colour"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5"/>
          <path d="M12 2a10 10 0 0 1 0 20" fill="white" fillOpacity="0.25"/>
          <circle cx="12" cy="7"  r="2" fill="white"/>
          <circle cx="17" cy="14" r="2" fill="white"/>
          <circle cx="7"  cy="14" r="2" fill="white"/>
        </svg>
      </button>

      {/* Arc item 3 — Sound toggle */}
      <button className="arc-item" onClick={toggleSound} aria-label={soundOn ? 'Mute sound' : 'Enable sound'}>
        {soundOn ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        )}
      </button>

      {/* Toggle button */}
      <button
        ref={toggleBtnRef}
        className="control-toggle"
        aria-label="Toggle controls"
        onClick={handleToggleClick}
      >
        <svg className="icon-grid" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="4"  cy="4"  r="2" fill="white" />
          <circle cx="12" cy="4"  r="2" fill="white" />
          <circle cx="4"  cy="12" r="2" fill="white" />
          <circle cx="12" cy="12" r="2" fill="white" />
        </svg>
      </button>
    </div>
  );
}
