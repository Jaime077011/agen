import { Background } from '@/components/Background';
import { NoiseBackground } from '@/components/NoiseBackground';
import { CursorTracker } from '@/components/CursorTracker';
import { BodyLoader } from '@/components/BodyLoader';
import { LangOverlay } from '@/components/LangOverlay';
import { ControlPanel } from '@/components/ControlPanel';
import { ServicesHero } from '@/components/ServicesHero';
import { ServiceBlock } from '@/components/ServiceBlock';
import { ServicesClosing } from '@/components/ServicesClosing';

const SERVICES = [
  {
    momentText: 'Your brand speaks first.',
    number: '01',
    name: 'Brand Identity',
    tagline: 'Strategy-led visual systems that own the room.',
    description:
      'We build brand identities that aren\'t just beautiful — they\'re strategic. Every mark, color, and typeface is chosen to position you exactly where you need to be in your market.',
    deliverables: [
      'Brand strategy & positioning',
      'Logo design & identity system',
      'Color, typography & visual language',
      'Brand guidelines document',
      'Application across key touchpoints',
    ],
    ctaLabel: "Build your brand",
  },
  {
    momentText: 'The store that sells itself.',
    number: '02',
    name: 'Web & Store',
    tagline: 'High-converting digital storefronts built to perform.',
    description:
      'We design and build websites and Shopify stores that turn visitors into customers. Performance, aesthetics, and conversion architecture — all working as one.',
    deliverables: [
      'UX strategy & wireframing',
      'Custom design system & UI',
      'Shopify or Next.js development',
      'Conversion rate optimization',
      'Speed, SEO & analytics setup',
    ],
    ctaLabel: "Launch your store",
  },
  {
    momentText: 'Work smarter. Scale faster.',
    number: '03',
    name: 'AI Systems',
    tagline: 'Custom automations that eliminate the manual work.',
    description:
      'We identify the repetitive processes draining your team\'s time and replace them with intelligent, custom-built AI workflows. Faster operations. More margin. Less noise.',
    deliverables: [
      'Workflow audit & opportunity mapping',
      'Custom AI agent development',
      'CRM, inbox & pipeline automation',
      'Internal knowledge base systems',
      'Ongoing optimization & support',
    ],
    ctaLabel: "Automate your workflow",
  },
];

export default function ServicesPage() {
  return (
    <>
      <Background />
      <NoiseBackground />
      <LangOverlay />
      <CursorTracker />
      <BodyLoader />
      <ServicesHero />
      {SERVICES.map((s, i) => (
        <ServiceBlock key={i} {...s} />
      ))}
      <ServicesClosing />
      <ControlPanel />
    </>
  );
}
