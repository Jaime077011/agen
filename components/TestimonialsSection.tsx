'use client';
import { useEffect, useRef } from 'react';

const ROWS = [
  [
    { quote: 'They rebuilt our brand from the ground up. We went from invisible to industry-defining in six months.', name: 'Alex Rivera', title: 'CEO, Forma Studio' },
    { quote: 'Our Shopify store conversion went from 1.2% to 4.8% after the redesign. The numbers speak for themselves.', name: 'Isabelle Morel', title: 'Founder, Maison Nord' },
    { quote: 'The AI workflow they built eliminated an entire manual process. Paid for itself in the first week.', name: 'Daniel Park', title: 'CTO, Relay Labs' },
    { quote: 'Every interaction felt like they genuinely cared about our success, not just the deliverable.', name: 'Yasmin Al-Rashid', title: 'Brand Director, Sable' },
    { quote: 'The brand system scales perfectly. Three products later, every touchpoint still feels cohesive.', name: 'Hugo Leclerc', title: 'Brand Manager, Vaux' },
    { quote: "If you're serious about your brand, stop shopping around. This is the agency.", name: 'Marcus Thompson', title: 'Founder, Iron Standard' },
    { quote: "Best ROI of any agency engagement in our company's history. Straightforward to say.", name: 'Luca Ferretti', title: 'CFO, Terroir Foods' },
    { quote: 'Within two months of launch our inbound leads doubled. The site does the selling for us now.', name: 'Sara Lindqvist', title: 'CMO, Northbound' },
  ],
  [
    { quote: 'Our rebrand helped us close our Series A. Investors commented on brand presence before anything else.', name: 'Nadia Ferraro', title: 'CEO, Kinetic Health' },
    { quote: "They don't just design — they think strategically. That combination is rare and incredibly valuable.", name: 'Oliver Banks', title: 'Partner, Meridian Capital' },
    { quote: "The landing page they built converts at nearly three times industry average. That's not luck, it's craft.", name: 'Sunita Kapoor', title: 'Growth Lead, Prism App' },
    { quote: 'I was skeptical about the AI pitch. Three months in, our team runs smoother than ever.', name: 'Felix Brandt', title: 'COO, Arkade Media' },
    { quote: 'Six weeks, tight budget. They delivered exactly what we needed without cutting a single corner.', name: 'Rachel Stone', title: 'VP Marketing, Drift Co.' },
    { quote: 'They challenged our assumptions in the best way. The final product was far better than we imagined.', name: 'Aisha Nwosu', title: 'Co-Founder, Atlas Tech' },
    { quote: 'The attention to detail is insane. Every pixel has a reason. Every word earns its place.', name: 'Mia Johansson', title: 'Creative Director, Raw Form' },
    { quote: 'Genuinely the best creative decision we made last year. Results followed immediately.', name: 'Tom Eriksson', title: 'Founder, Fieldswell' },
  ],
];

const CARD_W  = 420;
const CARD_GAP = 20;
const STEP    = (CARD_W + CARD_GAP) * 2;

export function TestimonialsSection() {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const tracksRef   = useRef<HTMLDivElement>(null);
  const cardRefs    = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let isCancelled = false;
    let ctx: { revert: () => void } | null = null;

    (async () => {
      const { default: gsap } = await import('gsap');
      const { ScrollTrigger }  = await import('gsap/ScrollTrigger');
      if (isCancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const cards = cardRefs.current;

        gsap.set(cards.filter(Boolean), { opacity: 0 });
        gsap.set([cards[0], cards[1], cards[8], cards[9]], { x: -60 });

        // Cards 4-7 / 12-15 only enter after the slide
        const overflowEls = [4, 5, 6, 7, 12, 13, 14, 15]
          .map(i => cards[i]).filter(Boolean) as HTMLDivElement[];

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 2.5,
            onEnter:     () => gsap.set(overflowEls, { opacity: 1 }),
            onLeaveBack: () => gsap.set(overflowEls, { opacity: 0 }),
          },
        });

        // ── Entry pair slides in; cards 3-4 of each row fade in together ──
        tl.to(
          [cards[0], cards[8], cards[1], cards[9]],
          { opacity: 1, x: 0, stagger: 0.12, duration: 0.55, ease: 'power2.out' },
        );
        tl.to(
          [cards[2], cards[3], cards[10], cards[11]],
          { opacity: 1, stagger: 0.06, duration: 0.45, ease: 'power2.out' },
          '<',
        );
        tl.to({}, { duration: 0.7 });

        // ── Both rows slide left ───────────────────────────────────────────
        tl.to(tracksRef.current, { x: -STEP, duration: 2.2, ease: 'power2.inOut' });
        tl.to({}, { duration: 0.7 });

        // ── Exit — tracks blur and dissolve out ───────────────────────────
        tl.to(tracksRef.current, {
          opacity: 0,
          filter: 'blur(16px)',
          scale: 1.03,
          duration: 1,
          ease: 'power2.inOut',
        });

      }, sectionRef);
    })();

    return () => {
      isCancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <div className="ts-section" ref={sectionRef}>
      <div className="ts-sticky">
        <div className="ts-tracks" ref={tracksRef}>
          {ROWS.map((row, ri) => (
            <div key={ri} className="ts-row">
              {row.map((t, ci) => (
                <div
                  key={ci}
                  className="ts-card"
                  ref={el => { cardRefs.current[ri * 8 + ci] = el; }}
                >
                  <span className="ts-card-glyph">&ldquo;</span>
                  <p className="ts-card-quote">{t.quote}</p>
                  <div className="ts-card-author">
                    <span className="ts-card-name">{t.name}</span>
                    <span className="ts-card-role">{t.title}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
