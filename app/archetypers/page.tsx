import { Background } from '@/components/Background';
import { NoiseBackground } from '@/components/NoiseBackground';
import { CursorTracker } from '@/components/CursorTracker';
import { BodyLoader } from '@/components/BodyLoader';
import { LangOverlay } from '@/components/LangOverlay';
import { ControlPanel } from '@/components/ControlPanel';
import { ArchetyperHero } from '@/components/ArchetyperHero';
import { AboutBlock } from '@/components/AboutBlock';
import { AboutClosing } from '@/components/AboutClosing';

const ABOUT_SECTIONS = [
  {
    momentText: 'We started by asking the hard questions.',
    number: '01',
    title: 'ORIGIN',
    tagline: 'Built in Cairo. Built for the world.',
    paragraphs: [
      'The Archetypers was founded on a simple observation: most businesses don\'t have a design problem — they have a clarity problem. A brand that doesn\'t communicate who they are, or a digital presence that actively works against them.',
      'We started as a small team of strategists, designers, and builders who believed great brand work should be both beautiful and functional. Work that earns attention and converts it into trust.',
    ],
    highlight: 'Our name comes from archetypes — the foundational patterns that shape how people perceive and trust a brand. We don\'t decorate. We define.',
  },
  {
    momentText: 'Design without strategy is decoration.',
    number: '02',
    title: 'PHILOSOPHY',
    tagline: 'Strategy first. Always.',
    paragraphs: [
      'Every project starts with a strategic question: what position does this brand need to own? Before we choose a typeface or write a line of code, we need to understand where you stand in your market — and where you need to go.',
      'We believe aesthetics should be a consequence of strategy, not the starting point. The brands we build look the way they do because that\'s exactly what the strategy demands.',
    ],
    highlight: 'A beautiful brand that confuses people is a failed brand. We build identities that are both distinctive and clear — ones that work as hard as you do.',
  },
  {
    momentText: 'We build systems, not assets.',
    number: '03',
    title: 'APPROACH',
    tagline: 'Systematic thinking. Precise execution.',
    paragraphs: [
      'We don\'t deliver logos — we deliver identity systems. We don\'t build pages — we build conversion architecture. Every element we create is part of a larger, integrated whole that performs across every touchpoint.',
      'Our process is collaborative and transparent. We move fast without being reckless, and we don\'t consider a project finished until the work is performing in the real world.',
    ],
    highlight: 'Most agencies hand over files. We hand over systems — documented, scalable, and built to grow with your business long after the project ends.',
  },
];

export default function ArchetyperPage() {
  return (
    <>
      <Background />
      <NoiseBackground />
      <LangOverlay />
      <CursorTracker />
      <BodyLoader />
      <ArchetyperHero />
      {ABOUT_SECTIONS.map((s, i) => (
        <AboutBlock key={i} {...s} />
      ))}
      <AboutClosing />
      <ControlPanel />
    </>
  );
}
