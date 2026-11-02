'use client';

import Image from 'next/image';
import { useRef, useState, type KeyboardEvent } from 'react';
import { photos } from '@/lib/site-content';
import { Arrow, BrandMark } from '../ui/Icons';
import { IntroFade } from '../ui/IntroFade';
import styles from './VillaSpacesSection.module.css';

// Original design: VillaSpacesBookSection.tsx. Restore by importing
// VillaSpacesBookSection as VillaSpacesSection in page.tsx; its styles are retained.
const spaces = [
  { photo: photos[0], label: 'Living room', prelude: 'ROOM FOR GOOD COMPANY', title: <>A softer kind <em>of welcome.</em></>, description: 'Light-filled arches. Warm, considered interiors. A place to gather, settle in, and let the conversation wander.', note: 'Together feels effortless here.' },
  { photo: photos[2], label: 'Private pool', prelude: 'OUT IN THE OPEN', title: <>A little less on the <em>agenda.</em></>, description: 'Take a dip. Stay a while. Repeat. Your own private pool, with room for the afternoon to find its own pace.', note: 'A moment, entirely your own.' },
  { photo: photos[1], label: 'Bedrooms', prelude: 'A SOFTER START', title: <>Rest comes <em>naturally.</em></>, description: 'A greener view. An unhurried morning. Three bedrooms to retreat to, with a quiet corner to make your own.', note: 'No alarm. No agenda. Just you.' },
  { photo: photos[8], label: 'The arrival', prelude: 'LEAVE THE EVERYDAY AT THE DOOR', title: <>Considered spaces. <em>Effortless days.</em></>, description: 'A sunlit passage, potted greens, and a softer welcome. From the first step inside, there’s permission to slow down.', note: 'You’re right where you need to be.' },
];

export function VillaSpacesSection() {
  const [active, setActive] = useState(0);
  const [requested, setRequested] = useState(0);
  const images = useRef<(HTMLImageElement | null)[]>([]);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const request = useRef(0);
  const activeRef = useRef(0);

  async function select(index: number) {
    const currentRequest = ++request.current;
    setRequested(index);
    if (index === activeRef.current) return;
    const image = images.current[index];
    if (!image) { setRequested(activeRef.current); return; }
    image.loading = 'eager';
    try {
      await image.decode();
      if (currentRequest !== request.current) return;
      activeRef.current = index;
      setActive(index);
    } catch {
      if (currentRequest === request.current) setRequested(activeRef.current);
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

  return <section id="bungalow" className={`${styles.section} section-padding`} aria-labelledby="bungalow-heading">
    <div className={styles.heading}>
      <IntroFade>
        <p className="eyebrow">VILLA ARCHWAY / THE BUNGALOW</p>
        <h2 id="bungalow-heading">Designed for time <em>well spent.</em></h2>
      </IntroFade>
      <IntroFade className={styles.introduction} delay={.12}>
        <BrandMark className={styles.mark} />
        <p>Arched windows. Warm interiors. Green views. A place to come together, with a little room to find yourself.</p>
      </IntroFade>
    </div>

    <div className={styles.explorer} id="spaces">
      <div className={styles.stage} data-villa-stage aria-busy={requested !== active}>
        {spaces.map((space, index) => <div
          className={`${styles.panel} ${active === index ? styles.active : ''}`}
          key={space.photo.id}
          id={`villa-panel-${space.photo.id}`}
          role="tabpanel"
          aria-labelledby={`villa-tab-${space.photo.id}`}
          aria-hidden={active !== index}
          inert={active !== index}
          tabIndex={active === index ? 0 : -1}
        >
          <Image ref={node => { images.current[index] = node; }} src={`${space.photo.id}.jpg`} alt={space.photo.alt} fill sizes="(max-width: 760px) 100vw, 65vw" loading={requested === index ? 'eager' : 'lazy'} />
          <div className={styles.shade} />
          <div className={styles.photoTop} aria-hidden="true"><span>A CLOSER LOOK AT THE SLOW LIFE</span><span>0{index + 1} / 04</span></div>
          <div className={styles.caption}>
            <p className={styles.prelude}>{space.prelude}</p>
            <h3>{space.title}</h3>
            <p className={styles.description}>{space.description}</p>
          </div>
        </div>)}
      </div>

      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeading}><span className="eyebrow">THE SPACES</span><p>Find your <br/>favourite corner.</p></div>
        <div className={styles.tabs} role="tablist" aria-label="Explore Villa Archway’s spaces" aria-orientation="vertical">
          {spaces.map((space, index) => <button
            ref={node => { tabs.current[index] = node; }}
            type="button"
            role="tab"
            id={`villa-tab-${space.photo.id}`}
            aria-label={space.label}
            aria-controls={`villa-panel-${space.photo.id}`}
            aria-selected={active === index}
            tabIndex={active === index ? 0 : -1}
            key={space.photo.id}
            onClick={() => { void select(index); }}
            onKeyDown={event => onTabKey(event, index)}
          >
            <span className={styles.tabNumber} aria-hidden="true">0{index + 1}</span>
            <span className={styles.tabCopy}><span className={styles.tabTitle}>{space.label}</span><span className={styles.tabNote} aria-hidden="true">{space.note}</span></span>
            <span className={styles.tabArrow}><Arrow diagonal /></span>
          </button>)}
        </div>
        <p className={styles.sidebarFootnote}>A PRIVATE VILLA.<br/>A SLOWER PACE.</p>
      </aside>
    </div>

    <div className={styles.footer}>
      <p>One villa. Your people. <span>Your own rhythm.</span></p>
      <a href="#gallery" className="text-link">Explore the photo journal <Arrow diagonal /></a>
    </div>
  </section>;
}
