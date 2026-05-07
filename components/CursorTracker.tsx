'use client';
import { useEffect } from 'react';

export function CursorTracker() {
  useEffect(() => {
    const dot     = document.getElementById('cursor-dot')     as HTMLElement | null;
    const ring    = document.getElementById('cursor-ring')    as HTMLElement | null;
    const service = document.getElementById('cursor-service') as HTMLElement | null;
    const link    = document.getElementById('cursor-link')    as HTMLElement | null;
    const consent = document.getElementById('cursor-consent') as HTMLElement | null;
    const control = document.getElementById('cursor-control') as HTMLElement | null;
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
    let linkX = targetX;
    let linkY = targetY;
    let consentX = targetX;
    let consentY = targetY;
    let controlX = targetX;
    let controlY = targetY;

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

    function enterLink() {
      if (link) link.classList.add('active');
      if (dot)  dot.style.opacity  = '0';
      if (ring) ring.style.opacity = '0';
    }

    function leaveLink() {
      if (link) link.classList.remove('active');
      if (dot)  dot.style.opacity  = '';
      if (ring) ring.style.opacity = '';
    }

    function enterConsent() {
      if (consent) consent.classList.add('active');
      if (dot)  dot.style.opacity  = '0';
      if (ring) ring.style.opacity = '0';
    }

    function leaveConsent() {
      if (consent) consent.classList.remove('active', 'decline');
      if (dot)  dot.style.opacity  = '';
      if (ring) ring.style.opacity = '';
    }

    function enterControl() {
      if (control) control.classList.add('active');
      if (dot)  dot.style.opacity  = '0';
      if (ring) ring.style.opacity = '0';
    }

    function leaveControl() {
      if (control) control.classList.remove('active');
      if (dot)  dot.style.opacity  = '';
      if (ring) ring.style.opacity = '';
    }

    const rows = document.querySelectorAll('.service-row');
    rows.forEach(row => {
      row.addEventListener('mouseenter', enterService);
      row.addEventListener('mouseleave', leaveService);
    });

    function onDocOver(e: MouseEvent) {
      const t = e.target as Element;
      if (t.closest('.service-row')) return;
      if (t.closest('.control-toggle')) {
        enterControl();
      } else if (t.closest('.consent-banner') && t.closest('a, button')) {
        if (consent) consent.classList.toggle('decline', !!t.closest('.consent-btn-decline'));
        enterConsent();
      } else if (t.closest('a, button')) {
        enterLink();
      }
    }
    function onDocOut(e: MouseEvent) {
      const related = e.relatedTarget as Element | null;
      if (related?.closest('.service-row')) return;
      if (!related?.closest('a, button')) {
        leaveLink();
        leaveConsent();
      }
      if (!related?.closest('.control-toggle')) {
        leaveControl();
      }
    }
    document.addEventListener('mouseover', onDocOver);
    document.addEventListener('mouseout',  onDocOut);

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
      if (link) {
        linkX = lerp(linkX, targetX, 0.18);
        linkY = lerp(linkY, targetY, 0.18);
        link.style.left = linkX + 'px';
        link.style.top  = linkY + 'px';
      }
      if (consent) {
        consentX = lerp(consentX, targetX, 0.18);
        consentY = lerp(consentY, targetY, 0.18);
        consent.style.left = consentX + 'px';
        consent.style.top  = consentY + 'px';
      }
      if (control) {
        controlX = lerp(controlX, targetX, 0.18);
        controlY = lerp(controlY, targetY, 0.18);
        control.style.left = controlX + 'px';
        control.style.top  = controlY + 'px';
      }
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
      document.removeEventListener('mouseover', onDocOver);
      document.removeEventListener('mouseout',  onDocOut);
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
      <div className="cursor-link" id="cursor-link">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M7 17L17 7M17 7H7M17 7v10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="cursor-consent" id="cursor-consent">
        <svg className="consent-icon-check" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <svg className="consent-icon-x" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="cursor-control" id="cursor-control" aria-hidden="true">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2 L13 11 L22 12 L13 13 L12 22 L11 13 L2 12 L11 11 Z" />
        </svg>
      </div>
    </>
  );
}
