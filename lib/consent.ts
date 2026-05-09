export interface ConsentData {
  cookies: boolean;
  sound:   boolean;
  v:       number;
}

function readCookie(): string | null {
  try {
    const entry = document.cookie
      .split('; ')
      .find(r => r.startsWith('site-consent='));
    return entry ? decodeURIComponent(entry.split('=').slice(1).join('=')) : null;
  } catch { return null; }
}

function parseConsent(raw: string | null): ConsentData | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw);
    if (!data.v) return null;
    return data as ConsentData;
  } catch { return null; }
}

export function getConsent(): ConsentData | null {
  if (typeof window === 'undefined') return null;
  // Try localStorage first (fast path), fall back to cookie (survives cleared storage / private mode)
  const lsRaw = (() => { try { return localStorage.getItem('site-consent'); } catch { return null; } })();
  return parseConsent(lsRaw) ?? parseConsent(readCookie());
}

export function setConsent(data: Omit<ConsentData, 'v'>) {
  const payload: ConsentData = { ...data, v: 1 };
  const value = JSON.stringify(payload);
  try { localStorage.setItem('site-consent', value); } catch { /* */ }
  try {
    const expires = new Date(Date.now() + 365 * 864e5).toUTCString();
    const secure  = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `site-consent=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax${secure}`;
  } catch { /* */ }
}
