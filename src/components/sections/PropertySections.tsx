import Image from 'next/image';
import { site } from '@/lib/site-content';
import { Reveal } from '../ui/Reveal';
import { Arrow, BrandMark, PropertyIcon } from '../ui/Icons';
import { IntroSlideshow } from './IntroSlideshow';
import { IntroFade } from '../ui/IntroFade';

export function IntroductionSection() {
  return (
    <section className="introduction section-padding" id="introduction" aria-labelledby="introduction-heading">
      <div className="intro-layout">
        <div className="intro-heading">
          <IntroFade className="intro-heading-meta" duration={.8}><p className="eyebrow">A PLACE TO JUST BE</p><span>01 / THE FEELING</span></IntroFade>
          <IntroFade as="h2" id="introduction-heading" delay={.12} duration={1.05}>A little further from <em>the everyday.</em></IntroFade>
        </div>
        <Reveal className="intro-portrait">
          <Image className="intro-leaf-watermark" src="/images/intro-leaves.webp" alt="" aria-hidden="true" width={1000} height={1000} unoptimized/><IntroSlideshow />
          <p className="intro-photo-caption"><span>THE QUIETER CORNERS</span><em>Yours to settle into.</em></p>
        </Reveal>
        <div className="intro-copy">
          <IntroFade as="p" className="intro-lead" delay={.2} duration={.9}>Some days call for a change of scenery.<br />Others, simply a change of pace.</IntroFade>
          <IntroFade as="p" delay={.32} duration={1}>Leave the full calendars behind. Come for the unhurried mornings, the conversations that wander, and the pleasure of having nowhere else to be.</IntroFade>
          <IntroFade className="intro-signature" delay={.4}><BrandMark /><span>This is <em>The Lit Stays.</em></span></IntroFade>
        </div>
      </div>
    </section>
  );
}

export function FactsSection() {
  const amenities = [
    { icon: 'villa' as const, label: 'Private villa' },
    { icon: 'bed' as const, label: `${site.propertyDetails.bedrooms} bedrooms` },
    { icon: 'bath' as const, label: `${site.propertyDetails.bathrooms} bathrooms` },
    { icon: 'pool' as const, label: 'Private pool' },
    { icon: 'guests' as const, label: `Up to ${site.propertyDetails.guestCapacity} guests` },
    { icon: 'wifi' as const, label: 'Wi-Fi access' },
  ];
  return <section className="facts facts-amenities section-padding" id="property-details" aria-labelledby="facts-heading">
    <div className="amenities-layout">
      <Reveal className="amenities-copy">
        <p className="eyebrow">VILLA ARCHWAY, AT A GLANCE</p>
        <h2 id="facts-heading">Room for you. <em>And your kind of together.</em></h2>
        <p className="amenities-description">Your own private villa, room to unwind, and the comforts that make settling in feel effortless. From a quiet bedroom to an afternoon by the pool, there’s a little space for everyone.</p>
        <p className="amenities-note">Every stay is exclusive to your group. Share your plans with us to find the right fit.</p>
        <a href={site.listing} target="_blank" rel="noopener noreferrer" className="text-link amenities-link">Full property details <Arrow diagonal/></a>
      </Reveal>
      <Reveal className="amenities-grid-wrap" delay={.08}>
        <ul className="amenities-grid" aria-label="Villa Archway comforts">
          {amenities.map(amenity => <li key={amenity.icon}><PropertyIcon kind={amenity.icon}/><span>{amenity.label}</span></li>)}
        </ul>
      </Reveal>
    </div>
  </section>;
}
