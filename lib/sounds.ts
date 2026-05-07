let _ctx: AudioContext | null = null;

export async function initAudio(): Promise<boolean> {
  try {
    if (!_ctx) _ctx = new AudioContext();
    if (_ctx.state !== 'running') await _ctx.resume();
    return _ctx.state === 'running';
  } catch (e) {
    console.error('[sound] init failed', e);
    return false;
  }
}

export function soundEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem('site-consent');
    if (!raw) return true;
    const d = JSON.parse(raw);
    if (!d.v) return true;
    return d.sound !== false;
  } catch { return true; }
}

function play(freq: number, dur: number, vol = 0.08) {
  if (!_ctx || _ctx.state !== 'running') return;
  try {
    const t   = _ctx.currentTime;
    const osc  = _ctx.createOscillator();
    const gain = _ctx.createGain();
    osc.connect(gain);
    gain.connect(_ctx.destination);
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  } catch (e) { console.error('[sound] play failed', e); }
}

export function playHover() {
  if (!soundEnabled()) return;
  play(800, 0.07, 0.04);
}

export function playClick() {
  if (!soundEnabled()) return;
  play(400, 0.1, 0.09);
}

function chime(freq: number, start: number, attack: number, sustain: number, release: number, vol: number, dest?: AudioNode) {
  if (!_ctx) return;
  const osc  = _ctx.createOscillator();
  const gain = _ctx.createGain();
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.001, start);
  gain.gain.linearRampToValueAtTime(vol, start + attack);
  gain.gain.setValueAtTime(vol, start + attack + sustain);
  gain.gain.linearRampToValueAtTime(0.001, start + attack + sustain + release);
  osc.connect(gain);
  gain.connect(dest ?? _ctx.destination);
  osc.start(start);
  osc.stop(start + attack + sustain + release + 0.05);
}

export function playPageOpen() {
  if (!soundEnabled()) return;
  if (!_ctx || _ctx.state !== 'running') return;
  const t = _ctx.currentTime;

  // Soft compressor so layers don't clip
  const comp = _ctx.createDynamicsCompressor();
  comp.threshold.value = -14;
  comp.ratio.value = 4;
  comp.connect(_ctx.destination);

  // Atmosphere pad — sets the cinematic mood before anything appears
  chime(110, t,      0.7, 2.5, 1.5, 0.08, comp);
  chime(220, t,      0.7, 2.0, 1.2, 0.05, comp);

  // Each note lands the instant its hero line starts animating in
  // heroScript  "Finally"     — 200 ms delay
  chime(330,       t + 0.20, 0.22, 0.55, 0.85, 0.13, comp);
  chime(330 * 1.003, t + 0.20, 0.22, 0.55, 0.85, 0.05, comp); // chorus detune

  // heroHeadline "built right." — 350 ms delay
  chime(440,       t + 0.35, 0.18, 0.45, 0.75, 0.11, comp);
  chime(440 * 1.003, t + 0.35, 0.18, 0.45, 0.75, 0.04, comp);

  // heroTagline                — 480 ms delay
  chime(554, t + 0.48, 0.15, 0.35, 0.60, 0.07, comp);

  // heroCta                   — 550 ms delay
  chime(659, t + 0.55, 0.12, 0.25, 0.50, 0.055, comp);

  // Final shimmer after everything is visible
  chime(880, t + 0.85, 0.10, 0.15, 0.40, 0.03, comp);
}

// ── Ambient pad ──────────────────────────────────────────────────────────────
let _ambientOscs: OscillatorNode[] = [];
let _ambientGain: GainNode | null  = null;

export function startAmbient() {
  if (!soundEnabled()) return;
  if (!_ctx || _ctx.state !== 'running') return;
  if (_ambientOscs.length) return; // already running

  _ambientGain = _ctx.createGain();
  _ambientGain.gain.setValueAtTime(0, _ctx.currentTime);
  _ambientGain.gain.linearRampToValueAtTime(0.05, _ctx.currentTime + 4); // slow fade-in
  _ambientGain.connect(_ctx.destination);

  // A-major chord, each layer micro-detuned for organic movement
  const layers: [number, number][] = [
    [220, 0.38], // A3
    [330, 0.28], // E4
    [440, 0.20], // A4
    [554, 0.14], // C#5
  ];
  layers.forEach(([freq, vol], i) => {
    const osc = _ctx!.createOscillator();
    const g   = _ctx!.createGain();
    osc.frequency.value = freq + i * 0.15; // tiny detune per layer
    osc.type = 'sine';
    g.gain.value = vol;
    osc.connect(g);
    g.connect(_ambientGain!);
    osc.start();
    _ambientOscs.push(osc);
  });

  // Slow "breathing" LFO — ~14-second cycle, ±0.008 gain swell
  const lfo    = _ctx.createOscillator();
  const lfoAmp = _ctx.createGain();
  lfo.type = 'sine';
  lfo.frequency.value = 0.07;
  lfoAmp.gain.value   = 0.008;
  lfo.connect(lfoAmp);
  lfoAmp.connect(_ambientGain.gain);
  lfo.start();
  _ambientOscs.push(lfo);
}

export function stopAmbient() {
  if (!_ctx || !_ambientGain) return;
  const gain = _ambientGain;
  const oscs = [..._ambientOscs];
  _ambientGain  = null;
  _ambientOscs  = [];
  gain.gain.cancelScheduledValues(_ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0, _ctx.currentTime + 2);
  setTimeout(() => {
    oscs.forEach(o => { try { o.stop(); } catch { /* already stopped */ } });
    try { gain.disconnect(); } catch { /* already disconnected */ }
  }, 2500);
}

let _momentPlayedAt = 0;
export function playMoment() {
  if (!soundEnabled()) return;
  if (!_ctx || _ctx.state !== 'running') return;
  const now = Date.now();
  if (now - _momentPlayedAt < 600) return; // debounce scrub re-fire
  _momentPlayedAt = now;
  const t = _ctx.currentTime;
  // Sharp chord strike + long ring — cinematic title-card feel
  chime(220, t,        0.02, 0.04, 2.2, 0.14);
  chime(330, t,        0.02, 0.04, 1.9, 0.09);
  chime(440, t + 0.03, 0.03, 0.06, 1.6, 0.07);
  chime(660, t + 0.06, 0.03, 0.04, 1.2, 0.04);
}

export function playConsentIn() {
  play(440, 0.35, 0.04);
  setTimeout(() => play(554, 0.35, 0.03), 80);
}

export function playAccept() {
  play(440, 0.15, 0.07);
  setTimeout(() => play(660, 0.2, 0.05), 100);
}

export function playDecline() {
  play(440, 0.15, 0.05);
  setTimeout(() => play(330, 0.2, 0.04), 100);
}
