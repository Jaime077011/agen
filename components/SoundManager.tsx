'use client';
import { useEffect } from 'react';
import { unlockAudioSync, initAudio, playHover, playClick, playPageOpen, startAmbient, soundEnabled } from '@/lib/sounds';
import { getConsent } from '@/lib/consent';

const UNLOCK_EVENTS = ['click', 'keydown', 'touchstart', 'touchend'] as const;
const UNLOCK_PASSIVE = ['wheel', 'touchmove'] as const;

export function SoundManager() {
  useEffect(() => {
    let unlocked = false;

    function unlock() {
      if (unlocked) return;
      unlocked = true;
      // Remove all unlock listeners synchronously before any await
      UNLOCK_EVENTS.forEach(e => window.removeEventListener(e, unlock));
      UNLOCK_PASSIVE.forEach(e => window.removeEventListener(e, unlock));
      // Unblock iOS AudioContext synchronously within the gesture handler
      unlockAudioSync();
      // Then wait for full resume and play cinematic if returning visitor
      initAudio().then(ok => {
        const hasConsent = !!getConsent();
        if (ok && hasConsent && soundEnabled()) {
          document.body.classList.remove('loaded');
          requestAnimationFrame(() => requestAnimationFrame(() => {
            document.body.classList.add('loaded');
            playPageOpen();
            startAmbient();
          }));
        }
      });
    }

    UNLOCK_EVENTS.forEach(e => window.addEventListener(e, unlock));
    UNLOCK_PASSIVE.forEach(e => window.addEventListener(e, unlock, { passive: true }));

    let lastHover: Element | null = null;

    function onOver(e: MouseEvent) {
      const t  = e.target as Element;
      const el = t.closest('a, button');
      if (el && el !== lastHover) {
        lastHover = el;
        playHover();
      }
    }

    function onOut(e: MouseEvent) {
      const t = e.relatedTarget as Element | null;
      if (!t?.closest('a, button')) lastHover = null;
    }

    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout',  onOut);
    document.addEventListener('click',     playClick);

    return () => {
      UNLOCK_EVENTS.forEach(e => window.removeEventListener(e, unlock));
      UNLOCK_PASSIVE.forEach(e => window.removeEventListener(e, unlock));
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout',  onOut);
      document.removeEventListener('click',     playClick);
    };
  }, []);

  return null;
}
