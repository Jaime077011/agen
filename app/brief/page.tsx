import { Background } from '@/components/Background';
import { NoiseBackground } from '@/components/NoiseBackground';
import { CursorTracker } from '@/components/CursorTracker';
import { BodyLoader } from '@/components/BodyLoader';
import { BriefForm } from '@/components/BriefForm';
import { BriefCursorManager } from '@/components/BriefCursorManager';
import { ControlPanel } from '@/components/ControlPanel';
import { LangOverlay } from '@/components/LangOverlay';

export default function Brief() {
  return (
    <>
      <Background />
      <NoiseBackground />
      <LangOverlay />
      <CursorTracker />
      <BodyLoader />
      <ControlPanel />
      <div className="brief-page">
        {/* Logo — top center */}
        <header className="brief-logo-bar anim-fade" style={{ '--delay': '80ms' } as React.CSSProperties}>
          <a href="/coming-soon" className="brief-logo-clip">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/TheArchetypers-02.png" alt="The Archetypers" />
          </a>
        </header>

        {/* Form */}
        <main className="brief-main">
          <BriefForm />
        </main>
        <BriefCursorManager />
      </div>
    </>
  );
}
