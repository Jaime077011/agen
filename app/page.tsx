import { Background } from '@/components/Background';
import { NoiseBackground } from '@/components/NoiseBackground';
import { BodyLoader } from '@/components/BodyLoader';
import { CursorTracker } from '@/components/CursorTracker';
import { LangOverlay } from '@/components/LangOverlay';
import { SiteSection } from '@/components/SiteSection';
import { ProjectsSection } from '@/components/ProjectsSection';
import { ProjectsCTA } from '@/components/ProjectsCTA';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { ContactSection } from '@/components/ContactSection';
import { ControlPanel } from '@/components/ControlPanel';

export default function Home() {
  return (
    <>
      <Background />
      <NoiseBackground />
      <LangOverlay />
      <CursorTracker />
      <BodyLoader />
      <SiteSection />
      <ProjectsSection />
      <ProjectsCTA />
      <TestimonialsSection />
      <ContactSection />
      <ControlPanel />
    </>
  );
}
