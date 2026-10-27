import Image from 'next/image';
import { site } from '@/lib/site-content';
import { Reveal } from '../ui/Reveal';
import { Arrow, BrandMark } from '../ui/Icons';
import { IntroSlideshow } from './IntroSlideshow';
import { IntroFade } from '../ui/IntroFade';

export function IntroductionSection() {
  return (
    <section className="introduction section-padding" id="introduction" aria-labelledby="introduction-heading">
      <div className="intro-layout">
        <div className="intro-heading">
          <IntroFade className="intro-heading-meta" duration={.8}><p className="eyebrow">A PLACE TO JUST BE</p><span>01 / THE FEELING</span></IntroFade>
          <IntroFade as="h2" id="introduction-heading" delay={.12} duration={1.05}>A little further<br />from <em>the everyday.</em></IntroFade>
        </div>
        <Reveal className="intro-portrait">
          <IntroSlideshow />
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
    { label: 'Private villa', value: '01', note: 'Entirely yours' },
    { label: 'Bedrooms', value: String(site.propertyDetails.bedrooms).padStart(2, '0'), note: 'Room to unwind' },
    { label: 'Bathrooms', value: String(site.propertyDetails.bathrooms).padStart(2, '0'), note: 'A little more ease' },
    { label: 'Swimming pool', value: 'Private', note: 'Take a moment' },
    { label: 'Guest capacity', value: `Up to ${site.propertyDetails.guestCapacity}`, note: 'Your favourite people' },
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
          <h2 id="facts-heading">Room for you.<br/><em>And your kind of together.</em></h2>
          <dl className="facts-inventory">{details.map(detail => <div key={detail.label}><dt>{detail.label}<span>{detail.note}</span></dt><dd>{detail.value}</dd></div>)}</dl>
          <div className="facts-sheet-footer"><p>Every stay is exclusive to your group. Share your plans with us to find the right fit.</p><a href={site.listing} target="_blank" rel="noopener noreferrer" className="text-link dark-link">Full property details <Arrow diagonal/></a></div>
        </Reveal>
      </div>
    </section>
  );
}

export function LocationSection() {
  return <section className="location section-padding" id="location" aria-labelledby="location-heading"><Reveal className="location-copy"><p className="eyebrow">A CHANGE OF SCENERY</p><h2 id="location-heading">A little closer<br/>to <em>somewhere else.</em></h2><p>Set in a gated community in Virar East, Villa Archway offers a green backdrop for a few days at a different pace.</p><div className="location-address"><span className="location-dot"/><span>{site.location}<small>INDIA</small></span></div><a className="text-link dark-link" href={site.directions} target="_blank" rel="noopener noreferrer">Explore the area <Arrow diagonal/></a><p className="location-note">Exact arrival directions are shared by your host.</p></Reveal><Reveal className="location-visual"><div className="image-frame"><Image src="aerial.jpg" alt="Aerial view of Villa Archway surrounded by lush trees with hills in the distance" fill sizes="(max-width: 700px) 100vw, 48vw"/></div><div className="location-stamp"><BrandMark/><span>A LITTLE OUT OF THE ORDINARY</span></div></Reveal></section>;
}
