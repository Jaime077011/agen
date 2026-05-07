'use client';
import { useState, useEffect } from 'react';
import { initAudio, playConsentIn, playAccept, playDecline, playPageOpen, startAmbient } from '@/lib/sounds';
import { getConsent, setConsent } from '@/lib/consent';

export function ConsentBanner() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [cookies, setCookies] = useState(true);
  const [sound, setSound] = useState(true);

  useEffect(() => {
    setMounted(true);
    if (!getConsent()) {
      const t = setTimeout(() => { setVisible(true); playConsentIn(); }, 900);
      return () => clearTimeout(t);
    }
  }, []);

  async function save(acceptToggles: boolean) {
    await initAudio();
    if (acceptToggles) playAccept(); else playDecline();
    setLeaving(true);
    setTimeout(() => {
      setConsent({
        cookies: acceptToggles ? cookies : false,
        sound:   acceptToggles ? sound   : false,
      });
      setVisible(false);
      setLeaving(false);
      if (acceptToggles && sound) {
        // Replay hero animation in sync with cinematic
        document.body.classList.remove('loaded');
        requestAnimationFrame(() => requestAnimationFrame(() => {
          document.body.classList.add('loaded');
          playPageOpen();
          startAmbient();
        }));
      }
    }, 380);
  }

  if (!mounted || !visible) return null;

  return (
    <>
    <div className={`consent-overlay${leaving ? ' out' : ''}`} aria-hidden="true" />
    <div className={`consent-banner${leaving ? ' out' : ''}`} role="dialog" aria-label="Site preferences">
      <p className="consent-title">Preferences</p>

      <div className="consent-options">
        <div className="consent-row">
          <span className="consent-label">
            <span className="consent-name">Cookies</span>
            <span className="consent-desc">Analytics &amp; performance</span>
          </span>
          <button
            className={`consent-toggle${cookies ? ' on' : ''}`}
            onClick={() => setCookies(v => !v)}
            aria-pressed={cookies}
            aria-label="Toggle cookies"
          />
        </div>

        <div className="consent-divider" />

        <div className="consent-row">
          <span className="consent-label">
            <span className="consent-name">Sound</span>
            <span className="consent-desc">Ambient audio &amp; effects</span>
          </span>
          <button
            className={`consent-toggle${sound ? ' on' : ''}`}
            onClick={() => setSound(v => !v)}
            aria-pressed={sound}
            aria-label="Toggle sound"
          />
        </div>
      </div>

      <button className="consent-btn-accept" onClick={() => save(true)}>
        Accept
      </button>
      <button className="consent-btn-decline" onClick={() => save(false)}>
        Decline all
      </button>
    </div>
    </>
  );
}
