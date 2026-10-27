import Image from 'next/image';
import { site } from '@/lib/site-content';
import { Reveal } from '../ui/Reveal';
import { Arrow, BrandMark } from '../ui/Icons';

export function IntroductionSection() {
  return (
    <section className="introduction section-padding" id="introduction" aria-labelledby="introduction-heading">
      <div className="intro-layout">
        <Reveal className="intro-heading">
          <div className="intro-heading-meta"><p className="eyebrow">A PLACE TO JUST BE</p><span>01 / THE FEELING</span></div>
          <h2 id="introduction-heading">A little further<br />from <em>the everyday.</em></h2>
        </Reveal>
        <Reveal className="intro-portrait">
          <div className="image-frame intro-portrait-image">
            <Image src="balcony.jpg" alt="A quiet balcony corner with woven chairs, a small table and a view into the trees at Villa Archway" fill sizes="(max-width: 700px) 85vw, 40vw" />
          </div>
          <p className="intro-photo-caption"><span>THE QUIETER CORNERS</span><em>Yours to settle into.</em></p>
        </Reveal>
        <Reveal className="intro-copy" delay={.1}>
          <p className="intro-lead">Some days call for a change of scenery.<br />Others, simply a change of pace.</p>
          <p>Leave the full calendars behind. Come for the unhurried mornings, the conversations that wander, and the pleasure of having nowhere else to be.</p>
          <div className="intro-signature"><BrandMark /><span>This is <em>The Lit Stays.</em></span></div>
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
  return (
    <section className="spaces section-padding" id="spaces" aria-labelledby="spaces-heading">
      <div className="spaces-top">
        <Reveal className="spaces-heading"><p className="eyebrow">ROOM TO MAKE YOURSELF AT HOME</p><h2 id="spaces-heading">Find your<br /><em>own rhythm.</em></h2></Reveal>
        <Reveal className="spaces-opening" delay={.08}><span className="spaces-chapter">02 / THE SPACES</span><p>For a quiet moment.<br />For everyone around the table.<br />For whatever the day becomes.</p></Reveal>
      </div>
      <div className="space-scene space-scene-pool">
        <Reveal className="space-scene-copy"><span className="space-scene-label">01 / OUT IN THE OPEN</span><h3>A little less<br />{' '}on the <em>agenda.</em></h3><p>Take a dip. Stay a while. Repeat.<br />The afternoon can find its own pace.</p><a href="#gallery" className="text-link dark-link">A closer look <Arrow diagonal /></a></Reveal>
        <Reveal className="space-scene-visual" delay={.08}><div className="image-frame"><Image src="pool.jpg" alt="The private pool at Villa Archway with blue water, warm walls and tropical plants" fill sizes="(max-width: 700px) 100vw, 63vw" /></div><span className="space-scene-caption">THE PRIVATE POOL</span></Reveal>
      </div>
      <div className="space-scene space-scene-bedroom">
        <Reveal className="space-scene-copy"><span className="space-scene-label">02 / A SOFTER START</span><h3>Rest comes<br />{' '}<em>naturally.</em></h3><p>A greener view. An unhurried morning.<br />Bedrooms to retreat to, at your own pace.</p><span className="space-scene-aside">No alarm. No agenda. Just you.</span></Reveal>
        <Reveal className="space-scene-visual" delay={.08}><div className="image-frame"><Image src="bedroom.jpg" alt="Warm bedroom interiors with a broad arched window overlooking the trees" fill sizes="(max-width: 700px) 90vw, 44vw" /></div><span className="space-scene-caption">THE BEDROOMS</span></Reveal>
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
