import { Bento } from '@/components/home/Bento';
import { FinalCta } from '@/components/home/FinalCta';
import { Hero } from '@/components/home/Hero';
import { PlatformStrip } from '@/components/home/PlatformStrip';
import { Principles } from '@/components/home/Principles';

/** `/` — overview (BRIEF §5): hero · principles · entry cards · platform coverage · CTA. */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Principles />
      <Bento />
      <PlatformStrip />
      <FinalCta />
    </>
  );
}
