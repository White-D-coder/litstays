'use client';

import Image from 'next/image';
import { useRef, useState, type KeyboardEvent } from 'react';
import { photos } from '@/lib/site-content';
import { Arrow } from '../ui/Icons';
import { IntroFade } from '../ui/IntroFade';
import { Reveal } from '../ui/Reveal';

const spaces = [
  { photo: photos[0], label: 'Living room', prelude: 'ROOM FOR GOOD COMPANY', title: <>A softer kind<br /><em>of welcome.</em></>, description: 'Light-filled arches. Warm, considered interiors. A place to gather, settle in, and let the conversation wander.', note: 'Together feels effortless here.' },
  { photo: photos[2], label: 'Private pool', prelude: 'OUT IN THE OPEN', title: <>A little less<br />on the <em>agenda.</em></>, description: 'Take a dip. Stay a while. Repeat. Your own private pool, with room for the afternoon to find its own pace.', note: 'A moment, entirely your own.' },
  { photo: photos[1], label: 'Bedrooms', prelude: 'A SOFTER START', title: <>Rest comes<br /><em>naturally.</em></>, description: 'A greener view. An unhurried morning. Three bedrooms to retreat to, with a quiet corner to make your own.', note: 'No alarm. No agenda. Just you.' },
  { photo: photos[8], label: 'The arrival', prelude: 'LEAVE THE EVERYDAY AT THE DOOR', title: <>Considered spaces.<br /><em>Effortless days.</em></>, description: 'A sunlit passage, potted greens, and a softer welcome. From the first step inside, there’s permission to slow down.', note: 'You’re right where you need to be.' },
];

export function VillaSpacesSection() {
  const [active, setActive] = useState(0);
  const [requested, setRequested] = useState(0);
  const images = useRef<(HTMLImageElement | null)[]>([]);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const request = useRef(0);

  async function select(index: number) {
    const currentRequest = ++request.current;
    setRequested(index);
    const image = images.current[index];
    if (!image) return;
    // Keep the existing photograph visible until its replacement is decoded.
    image.loading = 'eager';
    try {
      await image.decode();
      if (currentRequest === request.current) setActive(index);
    } catch {
      if (currentRequest === request.current) setRequested(active);
    }
  }

  function onTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % spaces.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index + spaces.length - 1) % spaces.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = spaces.length - 1;
    else return;
    event.preventDefault();
    tabs.current[next]?.focus();
    void select(next);
  }

  return <section id="bungalow" className="villa-spaces section-padding" aria-labelledby="bungalow-heading">
    <div className="villa-heading-row">
      <div className="villa-heading">
        <IntroFade><p className="eyebrow">VILLA ARCHWAY / THE BUNGALOW</p></IntroFade>
        <IntroFade as="h2" id="bungalow-heading" delay={.08} duration={.95}>Designed for<br />time <em>well spent.</em></IntroFade>
      </div>
      <IntroFade className="villa-introduction" delay={.16}>
        <span className="villa-location">A PRIVATE VILLA. A SLOWER PACE.</span>
        <p>Arched windows. Warm interiors. Green views that invite you to pause. There’s space for everyone to come together—and a corner to make your own.</p>
      </IntroFade>
    </div>

    <Reveal className="villa-explorer">
      <div className="villa-explorer-top" id="spaces">
        <p className="villa-explore-label">Find your favourite corner</p>
        <div className="villa-tabs" role="tablist" aria-label="Explore Villa Archway’s spaces">
          {spaces.map((space, index) => <button
            ref={node => { tabs.current[index] = node; }}
            type="button"
            role="tab"
            id={`villa-tab-${space.photo.id}`}
            aria-controls={`villa-panel-${space.photo.id}`}
            aria-selected={active === index}
            tabIndex={active === index ? 0 : -1}
            key={space.photo.id}
            onClick={() => { void select(index); }}
            onKeyDown={event => onTabKey(event, index)}
          ><span className="villa-tab-dot" aria-hidden="true" />{space.label}</button>)}
        </div>
      </div>

      <div className="villa-stage" aria-busy={requested !== active}>
        {spaces.map((space, index) => <div
          className={`villa-panel${active === index ? ' is-active' : ''}`}
          key={space.photo.id}
          id={`villa-panel-${space.photo.id}`}
          role="tabpanel"
          aria-labelledby={`villa-tab-${space.photo.id}`}
          aria-hidden={active !== index}
          inert={active !== index}
          tabIndex={active === index ? 0 : -1}
        >
          <div className="villa-photo">
            <Image ref={node => { images.current[index] = node; }} src={`${space.photo.id}.jpg`} alt={space.photo.alt} fill sizes="(max-width: 700px) 100vw, (max-width: 1100px) 58vw, 60vw" loading={requested === index ? 'eager' : 'lazy'} />
          </div>
          <div className="villa-story">
            <span className="villa-story-kicker">{space.prelude}</span>
            <div className="villa-story-main"><h3>{space.title}</h3><p>{space.description}</p></div>
            <p className="villa-story-note">{space.note}</p>
          </div>
        </div>)}
      </div>

      <div className="villa-explorer-footer">
        <p>One villa. Your people. <em>Your own rhythm.</em></p>
        <a href="#gallery" className="text-link dark-link">Explore the photo journal <Arrow diagonal /></a>
      </div>
    </Reveal>
  </section>;
}
