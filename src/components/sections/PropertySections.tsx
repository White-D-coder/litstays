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
  const details = [
    { icon: 'villa' as const, label: 'Private villa', value: '01', note: 'Entirely yours' },
    { icon: 'bed' as const, label: 'Bedrooms', value: String(site.propertyDetails.bedrooms).padStart(2, '0'), note: 'Room to unwind' },
    { icon: 'bath' as const, label: 'Bathrooms', value: String(site.propertyDetails.bathrooms).padStart(2, '0'), note: 'A little more ease' },
    { icon: 'pool' as const, label: 'Swimming pool', value: 'Private', note: 'Take a moment' },
    { icon: 'guests' as const, label: 'Guest capacity', value: `Up to ${site.propertyDetails.guestCapacity}`, note: 'Your favourite people' },
  ];
  return (
    <section className="facts section-padding" id="property-details" aria-labelledby="facts-heading">
      <div className="facts-layout">
        <Reveal className="facts-portrait">
          <div className="image-frame"><Image src="exterior.jpg" alt="The softly illuminated arches and balconies of Villa Archway at dusk" fill sizes="(max-width: 600px) 100vw, 40vw" /><span className="facts-image-caption">ONE VILLA. ALL YOURS.</span></div>
          <p className="image-caption">Your own little corner of the world.</p>
        </Reveal>
        <Reveal className="facts-sheet" delay={.1}>
          <p className="eyebrow">VILLA ARCHWAY, AT A GLANCE</p>
          <h2 id="facts-heading">Room for you. <em>And your kind of together.</em></h2>
          <dl className="facts-inventory">{details.map(detail => <div key={detail.label}><dt><PropertyIcon kind={detail.icon}/><span className="fact-label">{detail.label}<span>{detail.note}</span></span></dt><dd>{detail.value}</dd></div>)}</dl>
          <div className="facts-sheet-footer"><p>Every stay is exclusive to your group. Share your plans with us to find the right fit.</p><a href={site.listing} target="_blank" rel="noopener noreferrer" className="text-link dark-link">Full property details <Arrow diagonal/></a></div>
        </Reveal>
      </div>
    </section>
  );
}
