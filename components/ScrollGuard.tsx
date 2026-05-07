'use client';
import { useEffect } from 'react';

// Maximum pixels allowed per wheel event — above this is "fast scroll"
const MAX_PX = 50;

export function ScrollGuard() {
  useEffect(() => {
    function onWheel(e: WheelEvent) {
      // Normalize to pixels regardless of deltaMode
      let delta = e.deltaY;
      if (e.deltaMode === 1) delta *= 16;
      if (e.deltaMode === 2) delta *= window.innerHeight;

      // Slow or normal — don't touch it, let the browser handle natively
      if (Math.abs(delta) <= MAX_PX) return;

      // Fast — cap it and apply manually
      e.preventDefault();
      window.scrollBy({ top: Math.sign(delta) * MAX_PX, behavior: 'instant' });
    }

    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, []);

  return null;
}
