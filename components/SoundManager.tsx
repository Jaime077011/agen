'use client';
import { useEffect } from 'react';
import { unlockAudioSync, initAudio, playHover, playClick, playPageOpen, startAmbient, soundEnabled } from '@/lib/sounds';
import { getConsent } from '@/lib/consent';

const UNLOCK_EVENTS  = ['click', 'keydown', 'touchstart', 'touchend', 'pointerdown'] as const;
const UNLOCK_PASSIVE = ['wheel', 'touchmove'] as const;

export function SoundManager() {
  useEffect(() => {
    let unlocked  = false;
    let unlocking = false;

    function onAudioReady() {
      if (unlocked) return;
      unlocked = true;
      UNLOCK_EVENTS.forEach(e => window.removeEventListener(e, tryUnlock));
      UNLOCK_PASSIVE.forEach(e => window.removeEventListener(e, tryUnlock));
      if (!soundEnabled()) return;
      document.body.classList.remove('loaded');
      requestAnimationFrame(() => requestAnimationFrame(() => {
        document.body.classList.add('loaded');
        playPageOpen();
        startAmbient();
      }));
    }

    // Retries on every event until a real user-activation gesture lets resume() succeed.
    // wheel/scroll are NOT user activations on Chrome desktop so initAudio() returns
    // false after the 300 ms timeout and the listeners stay alive for the next click.
    function tryUnlock() {
      if (unlocked || unlocking) return;
      unlocking = true;
      unlockAudioSync();
      initAudio().then(ok => {
        unlocking = false;
        if (!ok) return;
        if (getConsent()) onAudioReady();
      });
    }

    UNLOCK_EVENTS.forEach(e => window.addEventListener(e, tryUnlock));
    UNLOCK_PASSIVE.forEach(e => window.addEventListener(e, tryUnlock, { passive: true }));

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
      UNLOCK_EVENTS.forEach(e => window.removeEventListener(e, tryUnlock));
      UNLOCK_PASSIVE.forEach(e => window.removeEventListener(e, tryUnlock));
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout',  onOut);
      document.removeEventListener('click',     playClick);
    };
  }, []);

  return null;
}
