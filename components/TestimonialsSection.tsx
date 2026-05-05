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
    { quote: 'Best ROI of any agency engagement in our company\'s history. Straightforward to say.', name: 'Luca Ferretti', title: 'CFO, Terroir Foods' },
  ],
  [
    { quote: 'Our rebrand helped us close our Series A. Investors commented on brand presence before anything else.', name: 'Nadia Ferraro', title: 'CEO, Kinetic Health' },
    { quote: "They don't just design — they think strategically. That combination is rare and incredibly valuable.", name: 'Oliver Banks', title: 'Partner, Meridian Capital' },
    { quote: 'The landing page they built converts at nearly three times industry average. That\'s not luck, it\'s craft.', name: 'Sunita Kapoor', title: 'Growth Lead, Prism App' },
    { quote: 'I was skeptical about the AI pitch. Three months in, our team runs smoother than ever.', name: 'Felix Brandt', title: 'COO, Arkade Media' },
    { quote: 'Six weeks, tight budget. They delivered exactly what we needed without cutting a single corner.', name: 'Rachel Stone', title: 'VP Marketing, Drift Co.' },
    { quote: 'They challenged our assumptions in the best way. The final product was far better than we imagined.', name: 'Aisha Nwosu', title: 'Co-Founder, Atlas Tech' },
    { quote: 'The attention to detail is insane. Every pixel has a reason. Every word earns its place.', name: 'Mia Johansson', title: 'Creative Director, Raw Form' },
  ],
];

const CARD_W      = 600;
const CARD_GAP    = 24;
const CARD_STRIDE = (CARD_W + CARD_GAP) * 2; // shift to reveal next pair

export function TestimonialsSection() {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const tracksRef   = useRef<HTMLDivElement>(null);
  const rowRefs     = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let isCancelled = false;
    let ctx: { revert: () => void } | null = null;

    (async () => {
      const { default: gsap } = await import('gsap');
      const { ScrollTrigger }  = await import('gsap/ScrollTrigger');
      if (isCancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const rows  = rowRefs.map(r => r.current);
        const cards = cardRefs.current; // 12 total: row0=[0-3], row1=[4-7], row2=[8-11]

        gsap.set(rows,  { opacity: 0 });
        gsap.set(cards, { opacity: 0, x: -50 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
          },
        });

        // ── Row 1 appears, first pair reveals card by card ────────────────
        tl.to(rows[0], { opacity: 1, duration: 0.5, ease: 'power2.out' });
        tl.to([cards[0], cards[1]], { opacity: 1, x: 0, stagger: 0.22, duration: 0.55, ease: 'power2.out' }, '<+0.1');
        tl.to({}, { duration: 0.5 });

        // ── Row 2 ─────────────────────────────────────────────────────────
        tl.to(rows[1], { opacity: 1, duration: 0.5, ease: 'power2.out' });
        tl.to([cards[4], cards[5]], { opacity: 1, x: 0, stagger: 0.22, duration: 0.55, ease: 'power2.out' }, '<+0.1');
        tl.to({}, { duration: 0.9 });

        // ── Slide 1 → reveal cards 3-4 of each row ───────────────────────
        tl.to(tracksRef.current, { x: -CARD_STRIDE, duration: 1.2, ease: 'power2.inOut' });
        tl.to([cards[2], cards[8]],  { opacity: 1, x: 0, stagger: 0.15, duration: 0.55, ease: 'power2.out' });
        tl.to([cards[3], cards[9]],  { opacity: 1, x: 0, stagger: 0.15, duration: 0.55, ease: 'power2.out' }, '>-0.2');
        tl.to({}, { duration: 0.9 });

        // ── Slide 2 → reveal cards 5-6 of each row ───────────────────────
        tl.to(tracksRef.current, { x: -CARD_STRIDE * 2, duration: 1.2, ease: 'power2.inOut' });
        tl.to([cards[4], cards[10]], { opacity: 1, x: 0, stagger: 0.15, duration: 0.55, ease: 'power2.out' });
        tl.to([cards[5], cards[11]], { opacity: 1, x: 0, stagger: 0.15, duration: 0.55, ease: 'power2.out' }, '>-0.2');
        tl.to({}, { duration: 0.9 });

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
            <div key={ri} className="ts-row" ref={rowRefs[ri]}>
              {row.map((t, ci) => (
                <div
                  key={ci}
                  className="ts-card"
                  ref={el => { cardRefs.current[ri * 4 + ci] = el; }}
                >
                  <p className="ts-card-quote">&ldquo;{t.quote}&rdquo;</p>
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
