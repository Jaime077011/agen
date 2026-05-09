'use client';
import { useEffect, useState } from 'react';
import { getConsent } from '@/lib/consent';

export function SoundPrompt() {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const consent = getConsent();
    // Show for any returning visitor who has sound enabled (or hasn't explicitly declined)
    if (consent && consent.sound === false) return;
    // Don't show to brand-new visitors — consent banner handles them
    if (!consent) return;

    function dismiss() {
      window.removeEventListener('pointerdown', dismiss);
      window.removeEventListener('keydown',     dismiss);
      setLeaving(true);
    }

    // Add dismiss listeners only AFTER the prompt is visible —
    // otherwise any click during the 1.4s window silently kills it before it appears
    const showTimer = setTimeout(() => {
      setVisible(true);
      window.addEventListener('pointerdown', dismiss);
      window.addEventListener('keydown',     dismiss);
    }, 1400);

    return () => {
      clearTimeout(showTimer);
      window.removeEventListener('pointerdown', dismiss);
      window.removeEventListener('keydown',     dismiss);
    };
  }, []);

  // Unmount after the leave animation finishes
  useEffect(() => {
    if (!leaving) return;
    const t = setTimeout(() => setVisible(false), 400);
    return () => clearTimeout(t);
  }, [leaving]);

  if (!visible) return null;

  return (
    <div className={`sound-prompt${leaving ? ' out' : ''}`} aria-hidden="true">
      <svg className="sound-prompt-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      </svg>
      <span>Click for sound</span>
    </div>
  );
}
