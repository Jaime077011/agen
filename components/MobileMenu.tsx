'use client';
import { useLang } from '@/lib/lang-context';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const { t } = useLang();
  return (
    <div className={`mobile-menu${open ? ' open' : ''}`}>
      <button className="mobile-menu-close" aria-label="Close menu" onClick={onClose}>✕</button>
      <ul>
        <li><a href="/archetypers" onClick={onClose}>{t.nav1}</a></li>
        <li><a href="/services" onClick={onClose}>{t.nav2}</a></li>
        <li><a href="/projects" onClick={onClose}>{t.nav3}</a></li>
        <li><a href="/contact" onClick={onClose}>{t.nav4}</a></li>
      </ul>
    </div>
  );
}
