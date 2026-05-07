import { Background } from '@/components/Background';
import { NoiseBackground } from '@/components/NoiseBackground';
import { CursorTracker } from '@/components/CursorTracker';
import { BodyLoader } from '@/components/BodyLoader';
import { LangOverlay } from '@/components/LangOverlay';
import { ControlPanel } from '@/components/ControlPanel';
import { ProjectsHero } from '@/components/ProjectsHero';
import { ProjectBlock } from '@/components/ProjectBlock';
import { ProjectsClosing } from '@/components/ProjectsClosing';

const PROJECTS = [
  {
    momentText: 'A brand that owns the room.',
    number: '01',
    name: 'Project Name One',
    category: 'Brand Identity',
    client: 'Client Industry · Year',
    description:
      'A complete brand overhaul for a fast-growing business that needed to compete at a higher level. We built a strategic identity that repositioned them in their market and gave them a visual system built to scale.',
    outcomes: [
      'Full identity system, logo, and brand guidelines',
      '40% increase in conversion from pitch decks',
      'Rebranded across all digital and print touchpoints',
      'Launched in 8 weeks from brief to delivery',
    ],
    ctaLabel: 'View case study',
    href: '#',
  },
  {
    momentText: 'The store that sells itself.',
    number: '02',
    name: 'Project Name Two',
    category: 'Web & Store',
    client: 'Client Industry · Year',
    description:
      'A high-performance Shopify store built for a product brand with a great product but a website holding them back. We redesigned and rebuilt the entire frontend with conversion architecture at its core.',
    outcomes: [
      '3.2× increase in conversion rate post-launch',
      'Full custom Shopify theme built from scratch',
      'Sub-1.5s load time across mobile and desktop',
      'Integrated reviews, upsells, and abandoned cart flows',
    ],
    ctaLabel: 'View case study',
    href: '#',
  },
  {
    momentText: 'Work smarter. Scale faster.',
    number: '03',
    name: 'Project Name Three',
    category: 'AI Systems',
    client: 'Client Industry · Year',
    description:
      'A custom AI workflow built for a service business spending 20+ hours per week on manual follow-up, proposal writing, and reporting. We mapped, built, and deployed a suite of automations that eliminated the drag.',
    outcomes: [
      '22 hours per week recovered across the team',
      'AI-powered proposal generation in under 2 minutes',
      'CRM pipeline fully automated with smart routing',
      'Client onboarding time cut from 3 days to 4 hours',
    ],
    ctaLabel: 'View case study',
    href: '#',
  },
];

export default function ProjectsPage() {
  return (
    <>
      <Background />
      <NoiseBackground />
      <LangOverlay />
      <CursorTracker />
      <BodyLoader />
      <ProjectsHero />
      {PROJECTS.map((p, i) => (
        <ProjectBlock key={i} {...p} />
      ))}
      <ProjectsClosing />
      <ControlPanel />
    </>
  );
}
