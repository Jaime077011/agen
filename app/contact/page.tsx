import { Background } from '@/components/Background';
import { NoiseBackground } from '@/components/NoiseBackground';
import { CursorTracker } from '@/components/CursorTracker';
import { BodyLoader } from '@/components/BodyLoader';
import { LangOverlay } from '@/components/LangOverlay';
import { ControlPanel } from '@/components/ControlPanel';
import { ContactHero } from '@/components/ContactHero';
import { ContactForm } from '@/components/ContactForm';

export default function ContactPage() {
  return (
    <>
      <Background />
      <NoiseBackground />
      <LangOverlay />
      <CursorTracker />
      <BodyLoader />
      <ContactHero />
      <ContactForm />
      <ControlPanel />
    </>
  );
}
