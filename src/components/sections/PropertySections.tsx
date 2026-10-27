import Image from 'next/image';
import { site } from '@/lib/site-content';
import { Reveal } from '../ui/Reveal';
import { Arrow, BrandMark } from '../ui/Icons';

export function IntroductionSection() {
  return (
    <section className="introduction section-padding" id="introduction" aria-labelledby="introduction-heading">
      <Reveal className="intro-masthead">
        <p className="eyebrow"><span className="tiny-line" /> A PLACE TO JUST BE</p>
        <span className="section-number">01 / THE FEELING</span>
      </Reveal>
      <Reveal className="intro-statement">
        <span className="intro-side-note" aria-hidden="true">LEAVE A LITTLE ROOM FOR LIFE.</span>
        <h2 id="introduction-heading">A little further from<br /><em>the everyday.</em></h2>
      </Reveal>
      <div className="intro-afterword">
        <Reveal className="intro-signature"><BrandMark /><span>This is<br /><em>The Lit Stays.</em></span></Reveal>
        <Reveal className="intro-copy" delay={.1}>
          <p>Some days call for a change of scenery.<br />Others, simply a change of pace.</p>
          <p>Leave the full calendars behind. Come for the unhurried mornings, the conversations that wander, and the pleasure of having nowhere else to be.</p>
        </Reveal>
      </div>
    </section>
  );
}

export function BungalowSection() {
  return (
    <section className="bungalow section-padding" id="bungalow" aria-labelledby="bungalow-heading">
      <div className="bungalow-spread">
        <Reveal className="bungalow-main">
          <div className="image-frame bungalow-photo">
            <Image src="living.jpg" alt="Villa Archway’s light-filled living area with arched windows, natural tones and comfortable seating" fill sizes="(max-width: 600px) 100vw, 67vw" />
          </div>
          <div className="photo-caption"><span>VILLA ARCHWAY / THE LIVING SPACE</span><span>01 — 09</span></div>
        </Reveal>
        <Reveal delay={.12} className="bungalow-detail">
          <span className="detail-prelude">A softer kind<br /><em>of welcome.</em></span>
          <div className="image-frame">
            <Image src="arrival.jpg" alt="An intimate entrance passage with potted plants and tall arched windows" fill sizes="(max-width: 600px) 52vw, 24vw" />
          </div>
          <p className="image-caption">Considered spaces.<br />Effortless days.</p>
        </Reveal>
      </div>
      <div className="bungalow-story">
        <Reveal className="bungalow-heading"><p className="eyebrow">THE BUNGALOW</p><h2 id="bungalow-heading">Designed for<br />time <em>well spent.</em></h2></Reveal>
        <Reveal className="bungalow-description" delay={.08}>
          <p>Arched windows. Warm interiors. Green views that invite you to pause. At Villa Archway, there’s space for everyone to come together—and a corner to make your own.</p>
          <a href="#spaces" className="text-link dark-link">Find your favourite corner <Arrow diagonal /></a>
        </Reveal>
      </div>
    </section>
  );
}

export function SpacesSection() {
  return <section className="spaces section-padding" id="spaces" aria-labelledby="spaces-heading">
    <Reveal><div className="section-kicker"><span className="tiny-line"/><p className="eyebrow">ROOM TO MAKE YOURSELF AT HOME</p><span className="section-number">02 / THE SPACES</span></div><div className="section-title-row"><h2 id="spaces-heading">Find your <em>own rhythm.</em></h2><p>For a quiet moment.<br/>For everyone around the table.<br/>For whatever the day becomes.</p></div></Reveal>
    <div className="spaces-grid"><Reveal className="space-bedroom"><div className="image-frame"><Image src="bedroom.jpg" alt="A restful bedroom with a broad arched window overlooking greenery" fill sizes="(max-width: 700px) 100vw, 48vw"/></div><div className="space-caption"><span className="space-index">01</span><div><h3>Rest comes naturally.</h3><p>Bedrooms to retreat to, at your own pace.</p></div></div></Reveal><Reveal className="space-pool" delay={.12}><div className="image-frame"><Image src="pool.jpg" alt="The private pool at Villa Archway, framed by warm walls and tropical plants" fill sizes="(max-width: 700px) 100vw, 37vw"/></div><div className="space-caption"><span className="space-index">02</span><div><h3>A little less on the agenda.</h3><p>Take a dip. Stay a while. Repeat.</p></div></div></Reveal></div>
  </section>;
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
