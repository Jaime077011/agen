'use client';
import { useLang } from '@/lib/lang-context';

export function LangOverlay() {
  const { overlayOpacity } = useLang();
  return (
    <div
      className="lang-overlay"
      style={{ opacity: overlayOpacity }}
    />
  );
}
