'use client';
import { useState, useEffect, useRef } from 'react';
import { useLang } from '@/lib/lang-context';

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
  const [open, setOpen]         = useState(false);
  const [colorOpen, setColorOpen] = useState(false);
  const [accent, setAccent]     = useState('#c41230');

  const panelRef      = useRef<HTMLDivElement>(null);
  const toggleBtnRef  = useRef<HTMLButtonElement>(null);
  const didDragRef    = useRef(false);
  const isDraggingRef = useRef(false);
  const dragStartRef  = useRef({ x: 0, y: 0 });
  const panelStartRef = useRef({ x: 0, y: 0 });

  // Load saved accent on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('accent');
      if (saved) { applyAccent(saved); setAccent(saved); }
    } catch { /* */ }
  }, []);

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
        {lang === 'en' ? 'AR' : 'EN'}
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

      {/* Arc item 3 — WhatsApp */}
      <a
        href="https://wa.me/"
        target="_blank"
        rel="noopener noreferrer"
        className="arc-item arc-whatsapp"
        aria-label="WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>

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
