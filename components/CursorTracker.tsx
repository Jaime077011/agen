'use client';
import { useEffect } from 'react';

export function CursorTracker() {
  useEffect(() => {
    const dot     = document.getElementById('cursor-dot')     as HTMLElement | null;
    const ring    = document.getElementById('cursor-ring')    as HTMLElement | null;
    const service = document.getElementById('cursor-service') as HTMLElement | null;
    const bg      = document.getElementById('bg')             as HTMLElement | null;
    const glow    = document.getElementById('glow')           as HTMLElement | null;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let ringX = targetX;
    let ringY = targetY;
    let serviceX = targetX;
    let serviceY = targetY;

    function lerp(a: number, b: number, t: number) {
      return a + (b - a) * t;
    }

    function onMouseMove(e: MouseEvent) {
      targetX = e.clientX;
      targetY = e.clientY;
      if (dot) {
        dot.style.left = targetX + 'px';
        dot.style.top  = targetY + 'px';
      }
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const nx = (e.clientX - cx) / cx;
      const ny = (e.clientY - cy) / cy;
      if (bg) {
        bg.style.transform  = `translate(${nx * -18}px, ${ny * -12}px) scale(1.04)`;
        bg.style.transition = 'transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)';
      }
    }

    function enterService() {
      if (service) service.classList.add('active');
      if (dot)  dot.style.opacity  = '0';
      if (ring) ring.style.opacity = '0';
    }

    function leaveService() {
      if (service) service.classList.remove('active');
      if (dot)  dot.style.opacity  = '';
      if (ring) ring.style.opacity = '';
    }

    const rows = document.querySelectorAll('.service-row');
    rows.forEach(row => {
      row.addEventListener('mouseenter', enterService);
      row.addEventListener('mouseleave', leaveService);
    });

    let rafId: number;
    function animate() {
      currentX = lerp(currentX, targetX, 0.07);
      currentY = lerp(currentY, targetY, 0.07);
      if (glow) {
        glow.style.transform = `translate(calc(${currentX}px - 50%), calc(${currentY}px - 50%))`;
        glow.style.left = '0';
        glow.style.top  = '0';
      }
      if (ring) {
        ringX = lerp(ringX, targetX, 0.14);
        ringY = lerp(ringY, targetY, 0.14);
        ring.style.left = ringX + 'px';
        ring.style.top  = ringY + 'px';
      }
      if (service) {
        serviceX = lerp(serviceX, targetX, 0.18);
        serviceY = lerp(serviceY, targetY, 0.18);
        service.style.left = serviceX + 'px';
        service.style.top  = serviceY + 'px';
      }
      // If service cursor is active but mouse is no longer over a service row
      // (e.g. user scrolled away without moving the mouse), deactivate it
      if (service?.classList.contains('active')) {
        const el = document.elementFromPoint(targetX, targetY);
        if (!el?.closest('.service-row')) leaveService();
      }
      rafId = requestAnimationFrame(animate);
    }

    window.addEventListener('mousemove', onMouseMove);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      rows.forEach(row => {
        row.removeEventListener('mouseenter', enterService);
        row.removeEventListener('mouseleave', leaveService);
      });
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div className="cursor-dot" id="cursor-dot" />
      <div className="cursor-ring" id="cursor-ring" />
      <div className="cursor-service" id="cursor-service">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M7 17L17 7M17 7H7M17 7v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </>
  );
}
