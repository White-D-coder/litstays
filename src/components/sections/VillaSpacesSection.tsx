'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { photos } from '@/lib/site-content';
import { Arrow, BrandMark } from '../ui/Icons';
import { IntroFade } from '../ui/IntroFade';

const spaces = [
  { photo: photos[0], label: 'Living room', prelude: 'ROOM FOR GOOD COMPANY', title: <>A softer kind <em>of welcome.</em></>, description: 'Light-filled arches. Warm, considered interiors. A place to gather, settle in, and let the conversation wander.', note: 'Together feels effortless here.' },
  { photo: photos[2], label: 'Private pool', prelude: 'OUT IN THE OPEN', title: <>A little less on the <em>agenda.</em></>, description: 'Take a dip. Stay a while. Repeat. Your own private pool, with room for the afternoon to find its own pace.', note: 'A moment, entirely your own.' },
  { photo: photos[1], label: 'Bedrooms', prelude: 'A SOFTER START', title: <>Rest comes <em>naturally.</em></>, description: 'A greener view. An unhurried morning. Three bedrooms to retreat to, with a quiet corner to make your own.', note: 'No alarm. No agenda. Just you.' },
  { photo: photos[8], label: 'The arrival', prelude: 'LEAVE THE EVERYDAY AT THE DOOR', title: <>Considered spaces. <em>Effortless days.</em></>, description: 'A sunlit passage, potted greens, and a softer welcome. From the first step inside, there’s permission to slow down.', note: 'You’re right where you need to be.' },
];

function BookStory({ index }: { index: number }) {
  const space = spaces[index];
  return <><BrandMark className="villa-page-watermark"/><span className="villa-page-number" aria-hidden="true">0{index + 1}</span><span className="villa-story-kicker">{space.prelude}</span><div className="villa-story-main"><h3>{space.title}</h3><p>{space.description}</p></div><p className="villa-story-note">{space.note}</p></>;
}

export function VillaSpacesSection() {
  const [active, setActive] = useState(0);
  const [requested, setRequested] = useState(0);
  const images = useRef<(HTMLImageElement | null)[]>([]);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const request = useRef(0);

  const [turning, setTurning] = useState<{ from: number; to: number; direction: number; key: number } | null>(null);
  const activeRef = useRef(0);
  const track = useRef<HTMLDivElement>(null);
  const book = useRef<HTMLDivElement>(null);

  const select = useCallback(async (index: number) => {
    const currentRequest = ++request.current;
    setRequested(index);
    const image = images.current[index];
    if (!image || index === activeRef.current) return;
    image.loading = 'eager';
    try {
      await image.decode();
      if (currentRequest !== request.current) return;
      const previous = activeRef.current;
      const direction = index > previous ? 1 : -1;
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setTurning({ from: previous, to: index, direction, key: currentRequest });
      }
      activeRef.current = index;
      setActive(index);
    } catch {
      if (currentRequest === request.current) setRequested(activeRef.current);
    }
  }, []);

  useEffect(() => {
    if (!turning) return;
    const timer = setTimeout(() => setTurning(null), 1100);
    return () => clearTimeout(timer);
  }, [turning]);

  useEffect(() => {
    const element = track.current;
    const spread = book.current;
    if (!element || !spread) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let lastChapter = 0;
    function measure() {
      if (!element || !spread) return;
      element.style.setProperty('--villa-book-height', `${spread.offsetHeight}px`);
      element.dataset.scrollBook = String(!reduced.matches && spread.offsetHeight < window.innerHeight - 115);
    }
    function update() {
      frame = 0;
      if (!element || element.dataset.scrollBook !== 'true') return;
      const top = parseFloat(getComputedStyle(spread!).top) || 90;
      const rect = element.getBoundingClientRect();
      const distance = element.offsetHeight - spread!.offsetHeight;
      if (distance <= 0 || rect.bottom < top) return;
      if (rect.top > top) {
        if (lastChapter !== 0 && rect.top < window.innerHeight) { lastChapter = 0; void select(0); }
        return;
      }
      const progress = Math.min(1, Math.max(0, (top - rect.top) / distance));
      const chapter = Math.min(spaces.length - 1, Math.floor(progress * spaces.length));
      if (chapter !== lastChapter) { lastChapter = chapter; void select(chapter); }
    }
    const scroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new ResizeObserver(measure);
    observer.observe(spread);
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', scroll, { passive: true });
    reduced.addEventListener('change', measure);
    return () => { observer.disconnect(); window.removeEventListener('resize', measure); window.removeEventListener('scroll', scroll); reduced.removeEventListener('change', measure); cancelAnimationFrame(frame); };
  }, [select]);

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
    <div className="villa-book-track" ref={track}><div className="villa-explorer" ref={book}>
    <div className="villa-heading-row">
      <div className="villa-heading">
        <IntroFade><p className="eyebrow">VILLA ARCHWAY / THE BUNGALOW</p></IntroFade>
        <IntroFade as="h2" id="bungalow-heading" delay={.08} duration={.95}>Designed for time <em>well spent.</em></IntroFade>
      </div>
      <IntroFade className="villa-introduction" delay={.16}>
        <span className="villa-location">A PRIVATE VILLA. A SLOWER PACE.</span>
        <p>Arched windows. Warm interiors. Green views that invite you to pause. There’s space for everyone to come together—and a corner to make your own.</p>
      </IntroFade>
    </div>

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
          <div className="villa-story"><BookStory index={index}/></div>
        </div>)}
        {turning && <>
          <div className={`villa-under-page${turning.direction < 0 ? ' villa-under-story villa-story' : ''}`} aria-hidden="true">{turning.direction > 0 ? <Image src={`${spaces[turning.from].photo.id}.jpg`} alt="" fill sizes="50vw"/> : <><BookStory index={turning.from}/><Image className="villa-mobile-under-image" src={`${spaces[turning.from].photo.id}.jpg`} alt="" fill sizes="100vw"/></>}</div>
          <div key={turning.key} className={`villa-turn-sheet ${turning.direction > 0 ? 'turn-forward' : 'turn-backward'}`} aria-hidden="true" onAnimationEnd={event => { if (event.target === event.currentTarget) setTurning(null); }}>
            <div className="villa-sheet-front"><div className="villa-sheet-story villa-story"><BookStory index={turning.direction > 0 ? turning.from : turning.to}/></div><Image className="villa-mobile-sheet-image" src={`${spaces[turning.direction > 0 ? turning.from : turning.to].photo.id}.jpg`} alt="" fill sizes="100vw"/></div>
            <div className="villa-sheet-back"><Image src={`${spaces[turning.direction > 0 ? turning.to : turning.from].photo.id}.jpg`} alt="" fill sizes="50vw"/></div>
          </div>
        </>}

      </div>

      <div className="villa-explorer-footer">
        <p>One villa. Your people. <em>Your own rhythm.</em><span className="villa-book-hint">SCROLL TO TURN THE PAGE</span></p>
        <a href="#gallery" className="text-link dark-link">Explore the photo journal <Arrow diagonal /></a>
      </div>
    </div></div>
  </section>;
}
