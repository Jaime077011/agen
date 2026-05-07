'use client';
import { useEffect, useRef, useState } from 'react';

const SERVICES = [
  'Brand Identity',
  'Web & Store',
  'AI Systems',
  'Multiple services',
  "I'm not sure yet",
];

const STEPS = [
  { n: '01', text: 'We review your brief and get back within 24 hours.' },
  { n: '02', text: 'We schedule a free discovery call — no pitch, just questions.' },
  { n: '03', text: 'We propose a focused plan with clear scope and timeline.' },
];

const SOCIALS = [
  { label: 'Instagram', href: '#' },
  { label: 'LinkedIn', href: '#' },
  { label: 'Behance',  href: '#' },
];

export function ContactForm() {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const leftRef     = useRef<HTMLDivElement>(null);
  const labelRef    = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const stepsRef    = useRef<HTMLDivElement>(null);
  const detailsRef  = useRef<HTMLDivElement>(null);
  const rightRef    = useRef<HTMLDivElement>(null);
  const footerRef   = useRef<HTMLDivElement>(null);

  const [submitted, setSubmitted] = useState(false);
  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');
  const [service, setService] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let isCancelled = false;
    let ctx: { revert: () => void } | null = null;

    (async () => {
      const { default: gsap } = await import('gsap');
      const { ScrollTrigger }  = await import('gsap/ScrollTrigger');
      if (isCancelled) return;

      gsap.registerPlugin(ScrollTrigger);
      const ease = 'power2.out';

      ctx = gsap.context(() => {
        const trigger = (el: Element | null, start = 'top 80%') => ({
          scrollTrigger: { trigger: el, start, toggleActions: 'play none none none' },
        });

        gsap.fromTo(labelRef.current,
          { opacity: 0, x: -24 },
          { opacity: 1, x: 0, duration: 0.6, ease, ...trigger(labelRef.current) });

        const hChars = Array.from(headlineRef.current?.querySelectorAll('.char') ?? []);
        gsap.fromTo(hChars,
          { opacity: 0, filter: 'blur(10px)' },
          { opacity: 1, filter: 'blur(0px)', stagger: 0.025, duration: 0.7, ease, ...trigger(headlineRef.current) });

        const steps = Array.from(stepsRef.current?.querySelectorAll('.ctf-step') ?? []);
        gsap.fromTo(steps,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, stagger: 0.15, duration: 0.7, ease, ...trigger(stepsRef.current) });

        gsap.fromTo(detailsRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.7, ease, ...trigger(detailsRef.current) });

        gsap.fromTo(rightRef.current,
          { opacity: 0, x: 40 },
          { opacity: 1, x: 0, duration: 1, ease, ...trigger(rightRef.current, 'top 85%') });

        const fields = Array.from(rightRef.current?.querySelectorAll('.ctf-field') ?? []);
        gsap.fromTo(fields,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease, ...trigger(rightRef.current, 'top 80%') });

        gsap.fromTo(footerRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.8, ease, ...trigger(footerRef.current) });

      }, sectionRef);
    })();

    return () => {
      isCancelled = true;
      ctx?.revert();
    };
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section className="ctf-section" id="contact" ref={sectionRef}>
      <div className="ctf-inner">

        {/* ── Left info ──────────────────────────────────────────────── */}
        <div className="ctf-left" ref={leftRef}>
          <span className="ctf-label" ref={labelRef}>Get in touch</span>

          <h2 className="ctf-headline" ref={headlineRef}>
            {`Let's talk about\nyour project.`.split('').map((c, i) => (
              <span key={i} className="char" style={{ whiteSpace: 'pre' }}>{c}</span>
            ))}
          </h2>

          <div className="ctf-steps" ref={stepsRef}>
            {STEPS.map(s => (
              <div key={s.n} className="ctf-step">
                <span className="ctf-step-num">{s.n}</span>
                <p className="ctf-step-text">{s.text}</p>
              </div>
            ))}
          </div>

          <div className="ctf-details" ref={detailsRef}>
            <a href="mailto:hello@thearchetypers.com" className="ctf-detail-email">
              hello@thearchetypers.com
            </a>
            <p className="ctf-detail-location">Cairo, Egypt</p>
          </div>
        </div>

        {/* ── Right form ─────────────────────────────────────────────── */}
        <div className="ctf-right" ref={rightRef}>
          {submitted ? (
            <div className="ctf-success">
              <span className="ctf-success-icon">✓</span>
              <h3 className="ctf-success-title">Message sent.</h3>
              <p className="ctf-success-text">
                We&apos;ll review your brief and get back to you within 24 hours.
              </p>
            </div>
          ) : (
            <form className="ctf-form" onSubmit={handleSubmit}>
              <div className="ctf-field">
                <label className="ctf-field-label">Name</label>
                <input
                  className="ctf-input"
                  type="text"
                  placeholder="Your name"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
              <div className="ctf-field">
                <label className="ctf-field-label">Email</label>
                <input
                  className="ctf-input"
                  type="email"
                  placeholder="your@email.com"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div className="ctf-field">
                <label className="ctf-field-label">Service</label>
                <select
                  className="ctf-select"
                  value={service}
                  onChange={e => setService(e.target.value)}
                >
                  <option value="" disabled>What can we help with?</option>
                  {SERVICES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="ctf-field ctf-field--tall">
                <label className="ctf-field-label">Message</label>
                <textarea
                  className="ctf-textarea"
                  placeholder="Tell us about your project — what you're building, what's not working, or where you want to go."
                  required
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                />
              </div>
              <div className="ctf-submit-wrap">
                <button className="hero-cta ctf-submit" type="submit">
                  Send message
                </button>
                <p className="ctf-submit-note">We reply within 24 hours.</p>
              </div>
            </form>
          )}
        </div>

      </div>

      {/* ── Footer strip ───────────────────────────────────────────────── */}
      <div className="ctf-footer" ref={footerRef}>
        <div className="ctf-footer-meta">
          <p className="ctf-footer-tagline">
            Strategy, design, and growth — built as one system.
          </p>
          <div className="ctf-footer-socials">
            {SOCIALS.map((s, i) => (
              <span key={s.label} style={{ display: 'contents' }}>
                {i > 0 && <span className="ctf-footer-sep">·</span>}
                <a href={s.href} className="ctf-footer-social" target="_blank" rel="noopener noreferrer">
                  {s.label}
                </a>
              </span>
            ))}
          </div>
        </div>
        <div className="ctf-footer-bottom">
          <p className="ctf-footer-copy">
            &copy; {new Date().getFullYear()} The Archetypers. All rights reserved.
          </p>
          <p className="ctf-footer-location">Cairo, Egypt</p>
        </div>
      </div>
    </section>
  );
}
