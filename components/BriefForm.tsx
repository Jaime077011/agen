'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLang } from '@/lib/lang-context';

type BillingType = 'one-time' | 'monthly';

const ICONS = {
  brand:  (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="10.5" r="2.5"/><circle cx="8.5" cy="7.5" r="2.5"/><circle cx="6.5" cy="12.5" r="2.5"/><path d="M12 22C6.5 22 2 17.5 2 12S6.5 2 12 2"/><path d="M22 12a10 10 0 0 1-10 10"/></svg>),
  web:    (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>),
  ai:     (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3"/><path d="M15 1v3"/><path d="M9 20v3"/><path d="M15 20v3"/><path d="M1 9h3"/><path d="M1 15h3"/><path d="M20 9h3"/><path d="M20 15h3"/></svg>),
  social: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>),
  video:  (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>),
  full:   (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>),
};

const MIN_BUDGET = 0;
const MAX_BUDGET = 50000;
const STEP = 100;

function fmt(n: number) {
  return '$' + n.toLocaleString();
}

export function BriefForm() {
  const router = useRouter();
  const { t, lang } = useLang();
  const isAr = lang === 'ar-eg' || lang === 'ar-sa';

  const SERVICES = [
    { id: 'brand',  billing: 'one-time' as BillingType, name: t.briefSvcBrandName,  desc: t.briefSvcBrandDesc  },
    { id: 'web',    billing: 'one-time' as BillingType, name: t.briefSvcWebName,    desc: t.briefSvcWebDesc    },
    { id: 'ai',     billing: 'one-time' as BillingType, name: t.briefSvcAiName,     desc: t.briefSvcAiDesc     },
    { id: 'social', billing: 'monthly'  as BillingType, name: t.briefSvcSocialName, desc: t.briefSvcSocialDesc },
    { id: 'video',  billing: 'one-time' as BillingType, name: t.briefSvcVideoName,  desc: t.briefSvcVideoDesc  },
    { id: 'full',   billing: 'monthly'  as BillingType, name: t.briefSvcFullName,   desc: t.briefSvcFullDesc   },
  ];

  const [step, setStep]         = useState(1);
  const [dir, setDir]           = useState<'next' | 'back'>('next');
  const [selected, setSelected] = useState<string[]>([]);
  const [budget, setBudget]     = useState(2500);
  const [billing, setBilling]   = useState<BillingType>('one-time');
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [message, setMessage]   = useState('');

  function goTo(n: number) {
    setDir(n > step ? 'next' : 'back');
    setStep(n);
  }

  const hasMonthly = selected.some(id => SERVICES.find(s => s.id === id)?.billing === 'monthly');
  const hasOneTime = selected.some(id => SERVICES.find(s => s.id === id)?.billing === 'one-time');
  const showToggle = hasMonthly && hasOneTime;

  useEffect(() => {
    if (hasMonthly) setBilling('monthly');
    else setBilling('one-time');
  }, [selected, hasMonthly]);

  function toggleService(id: string) {
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  }

  function handleSubmit() {
    console.log({ services: selected, budget, billing, name, email, whatsapp, message });
    goTo(4);
  }

  const pct = ((budget - MIN_BUDGET) / (MAX_BUDGET - MIN_BUDGET)) * 100;

  return (
    <div className="ctf2-panel visible">

      {/* Step dots */}
      {step < 4 && (
        <div className="ctf2-steps">
          {[1, 2, 3].map(n => (
            <div key={n} className={`ctf2-dot${step === n ? ' active' : step > n ? ' done' : ''}`} />
          ))}
        </div>
      )}

      {/* ── Step 1: Services ── */}
      {step === 1 && (
        <div key={`step-1-${dir}`} className={`ctf2-step-anim ctf2-step-${isAr ? (dir === 'next' ? 'back' : 'next') : dir}`}><>
          <div className="ctf2-header">
            <p className="ctf2-label">{t.briefStep1}</p>
            <h2 className="ctf2-title">{t.briefTitle1}</h2>
            <p className="ctf2-subtitle">{t.briefSub1}</p>
          </div>

          <div className="ctf2-services">
            {SERVICES.map(s => (
              <button
                key={s.id}
                className={`ctf2-service-card${selected.includes(s.id) ? ' selected' : ''}`}
                onClick={() => toggleService(s.id)}
              >
                <div className="ctf2-service-check">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <div className="ctf2-service-icon">{ICONS[s.id as keyof typeof ICONS]}</div>
                <p className="ctf2-service-name">{s.name}</p>
                <p className="ctf2-service-desc">{s.desc}</p>
              </button>
            ))}
          </div>

          <div className="ctf2-nav">
            <button className="ctf2-next" disabled={selected.length === 0} onClick={() => goTo(2)}>
              {t.briefNext}
            </button>
          </div>
        </></div>
      )}

      {/* ── Step 2: Budget ── */}
      {step === 2 && (
        <div key={`step-2-${dir}`} className={`ctf2-step-anim ctf2-step-${isAr ? (dir === 'next' ? 'back' : 'next') : dir}`}><>
          <div className="ctf2-header">
            <p className="ctf2-label">{t.briefStep2}</p>
            <h2 className="ctf2-title">{t.briefTitle2}</h2>
            <p className="ctf2-subtitle">{t.briefSub2}</p>
          </div>

          <div className="ctf2-budget-body">
            {(showToggle || hasMonthly) && (
              <div className="ctf2-billing-toggle">
                <button className={`ctf2-billing-btn${billing === 'one-time' ? ' active' : ''}`} onClick={() => setBilling('one-time')}>
                  {t.briefOneTime}
                </button>
                <button className={`ctf2-billing-btn${billing === 'monthly' ? ' active' : ''}`} onClick={() => setBilling('monthly')}>
                  {t.briefMonthly}
                </button>
              </div>
            )}

            <div className="ctf2-budget-amount">
              <span className="ctf2-budget-currency">{fmt(budget)}</span>
              <span className="ctf2-budget-period">
                {billing === 'monthly' ? t.briefPerMonth : t.briefOneTimePayment}
              </span>
            </div>

            <div className="ctf2-budget-controls">
              <button className="ctf2-budget-btn" onClick={() => setBudget(b => Math.max(MIN_BUDGET, b - STEP))} aria-label="Decrease">−</button>
              <input
                type="range"
                className="ctf2-slider"
                min={MIN_BUDGET} max={MAX_BUDGET} step={STEP}
                value={budget}
                onChange={e => setBudget(Number(e.target.value))}
                style={{ background: `linear-gradient(to ${isAr ? 'left' : 'right'}, var(--accent) ${pct}%, rgba(255,255,255,0.12) ${pct}%)` }}
              />
              <button className="ctf2-budget-btn" onClick={() => setBudget(b => Math.min(MAX_BUDGET, b + STEP))} aria-label="Increase">+</button>
            </div>

            <p className="ctf2-budget-note">{t.briefSliderNote}</p>
          </div>

          <div className="ctf2-nav">
            <button className="ctf2-back" onClick={() => goTo(1)}>{t.briefBack}</button>
            <button className="ctf2-next" onClick={() => goTo(3)}>{t.briefNext}</button>
          </div>
        </></div>
      )}

      {/* ── Step 3: Info ── */}
      {step === 3 && (
        <div key={`step-3-${dir}`} className={`ctf2-step-anim ctf2-step-${isAr ? (dir === 'next' ? 'back' : 'next') : dir}`}><>
          <div className="ctf2-header">
            <p className="ctf2-label">{t.briefStep3}</p>
            <h2 className="ctf2-title">{t.briefTitle3}</h2>
            <p className="ctf2-subtitle">{t.briefSub3}</p>
          </div>

          <div className="ctf2-fields">
            <div className="ctf2-field">
              <label className="ctf2-field-label">{t.briefNameLabel}</label>
              <input className="ctf2-input" placeholder={t.briefNamePlaceholder} value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="ctf2-field">
              <label className="ctf2-field-label">{t.briefEmailLabel}</label>
              <input className="ctf2-input" type="email" placeholder={t.briefEmailPlaceholder} value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="ctf2-field">
              <label className="ctf2-field-label">{t.briefWhatsappLabel} <span className="ctf2-field-optional">{t.briefOptional}</span></label>
              <input className="ctf2-input" placeholder={t.briefWhatsappPlaceholder} value={whatsapp} onChange={e => setWhatsapp(e.target.value)} />
            </div>
            <div className="ctf2-field">
              <label className="ctf2-field-label">{t.briefMessageLabel} <span className="ctf2-field-optional">{t.briefOptional}</span></label>
              <textarea className="ctf2-textarea" placeholder={t.briefMessagePlaceholder} value={message} onChange={e => setMessage(e.target.value)} />
            </div>
          </div>

          <div className="ctf2-nav">
            <button className="ctf2-back" onClick={() => goTo(2)}>{t.briefBack}</button>
            <button className="ctf2-next" disabled={!name.trim() || !email.trim()} onClick={handleSubmit}>
              {t.briefSend}
            </button>
          </div>
        </></div>
      )}

      {/* ── Step 4: Success ── */}
      {step === 4 && (
        <div className="ctf2-success">
          <div className="ctf2-check">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" color="var(--accent)">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h2 className="ctf2-success-title">{t.briefSuccessTitle}</h2>
          <p className="ctf2-success-sub">{t.briefSuccessSub}</p>
          <button className="ctf2-next" style={{ maxWidth: '260px', margin: '0 auto' }} onClick={() => router.push('/coming-soon')}>
            {t.briefBackHome}
          </button>
        </div>
      )}

    </div>
  );
}
