export interface ConsentData {
  cookies: boolean;
  sound:   boolean;
  v:       number;
}

export function getConsent(): ConsentData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('site-consent');
    if (!raw) return null;
    const data = JSON.parse(raw);
    // No version field = old/corrupt consent — treat as not set so banner re-appears
    if (!data.v) return null;
    return data as ConsentData;
  } catch { return null; }
}

export function setConsent(data: Omit<ConsentData, 'v'>) {
  const payload: ConsentData = { ...data, v: 1 };
  const value = JSON.stringify(payload);
  try { localStorage.setItem('site-consent', value); } catch { /* */ }
  try {
    const expires = new Date(Date.now() + 365 * 864e5).toUTCString();
    document.cookie = `site-consent=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
  } catch { /* */ }
}
