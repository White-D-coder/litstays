import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { IntroductionSection, FactsSection } from '@/components/sections/PropertySections';
import { VillaSpacesSection } from '@/components/sections/VillaSpacesSection';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { GallerySection } from '@/components/sections/GallerySection';
import { BookingSection } from '@/components/sections/BookingSection';
import { AvailabilitySection } from '@/components/sections/AvailabilitySection';
import { StayProvider } from '@/components/availability/StayProvider';
import { FAQSection } from '@/components/sections/FAQSection';

export default function Home() {
  return <><Navbar/><main id="main">
    <StayProvider>
      <HeroSection/>
      <div className="page-surface">
        <IntroductionSection/>
        <VillaSpacesSection/>
        <FactsSection/>
        <ExperienceSection/>
        <GallerySection/>
        <FAQSection/>
        <AvailabilitySection/>
        <BookingSection/>
        <Footer/>
        </div>
        </StayProvider>
        </main>
        </>;
}
