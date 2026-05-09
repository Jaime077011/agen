'use client';
import { useState } from 'react';
import { useLang } from '@/lib/lang-context';
import { MobileMenu } from './MobileMenu';

export function Nav() {
  const { t } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="nav anim-fade" style={{ '--delay': '100ms' } as React.CSSProperties}>
        <a href="/" className="nav-logo">
          <div className="logo-clip">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/TheArchetypers-02.png" alt="The Archetypers" />
          </div>
        </a>
        <ul className="nav-links">
          <li><a href="/archetypers">{t.nav1}</a></li>
          <li><a href="/services">{t.nav2}</a></li>
          <li><a href="/projects">{t.nav3}</a></li>
          <li><a href="/contact">{t.nav4}</a></li>
        </ul>
        <button
          className="hamburger"
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
        >
          <span /><span /><span />
        </button>
      </nav>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
