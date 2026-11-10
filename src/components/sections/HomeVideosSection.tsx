'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import villaImageLoader from '@/lib/villa-image-loader';
import { Arrow } from '../ui/Icons';
import styles from './HomeVideosSection.module.css';

// Owner-supplied films, with cover photography from the approved villa library.
const films = [
  { id: 'ZkFFq16fB2I', title: 'Luxury Villa in Virar, Mumbai', href: 'https://www.youtube.com/watch?v=ZkFFq16fB2I', poster: '/archway/optimized/archway-aerial-1-1920.webp', alt: 'The villas surrounded by trees and green hills' },
  { id: 'sp49A-K0TmQ', title: 'Amenities at LIT Stays', href: 'https://www.youtube.com/watch?v=sp49A-K0TmQ', poster: '/avante/optimized/avante-15-1920.webp', alt: 'Villa Avante’s private pool and palm-framed courtyard' },
];
const shorts = [
  { id: '9ndnJAIcA1Y', title: 'You’ve earned this', href: 'https://www.youtube.com/shorts/9ndnJAIcA1Y', poster: '/archway/optimized/archway-aerial-2-1920.webp', alt: 'An aerial view of the villas and their green surroundings' },
  { id: '5RSpQchGXyk', title: 'A LIT weekend', href: 'https://www.youtube.com/shorts/5RSpQchGXyk', poster: '/avante/optimized/avante-26-1920.webp', alt: 'A quiet balcony looking out over trees' },
  { id: 'CCMzu5EdfyA', title: 'Check-in experience', href: 'https://www.youtube.com/shorts/CCMzu5EdfyA', poster: '/archway/optimized/archway-45-1920.webp', alt: 'The villa entrance passage lined with plants and arched windows' },
];
type Film = typeof films[number];

function FilmCarousel({ items, label, vertical, playing, onPlay }: {
  items: Film[]; label: string; vertical?: boolean; playing: string | null; onPlay: (id: string) => void;
}) {
  const track = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const [canBack, setCanBack] = useState(false);
  const [canNext, setCanNext] = useState(false);

  function update() {
    const list = track.current;
    if (!list) return;
    const maximum = list.scrollWidth - list.clientWidth;
    setCanBack(list.scrollLeft > 2);
    setCanNext(list.scrollLeft < maximum - 2);
    if (maximum < 2) { setActive(0); return; }
    if (list.scrollLeft >= maximum - 2) { setActive(items.length - 1); return; }
    const entries = Array.from(list.children) as HTMLElement[];
    let nearest = 0;
    entries.forEach((entry, index) => {
      if (Math.abs(entry.offsetLeft - list.scrollLeft) < Math.abs(entries[nearest].offsetLeft - list.scrollLeft)) nearest = index;
    });
    setActive(nearest);
  }
  useEffect(() => {
    const list = track.current;
    if (!list) return;
    const observer = new ResizeObserver(() => {
      const maximum = list.scrollWidth - list.clientWidth;
      setCanBack(list.scrollLeft > 2);
      setCanNext(list.scrollLeft < maximum - 2);
    });
    observer.observe(list);
    return () => observer.disconnect();
  }, []);

  function go(index: number) {
    const list = track.current;
    const item = list?.children[index] as HTMLElement | undefined;
    if (!list || !item) return;
    list.scrollTo({ left: item.offsetLeft, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }

  return <div className={styles.carousel}>
    <button type="button" className={`${styles.arrow} ${styles.previous}`} aria-label={`Previous ${label.toLowerCase()}`} disabled={!canBack} onClick={() => go(Math.max(0, active - 1))}><Arrow className={styles.backIcon} /></button>
    <ul ref={track} id={`film-${label.toLowerCase()}`} className={`${styles.track} ${vertical ? styles.shortsTrack : ''}`} aria-label={`LIT Stays ${label.toLowerCase()}`} onScroll={update}>
      {items.map(item => <li key={item.id} className={`${styles.card} ${vertical ? styles.shortCard : ''}`}>
        {playing === item.id ? <iframe className={styles.player} title={item.title}
          src={`https://www.youtube-nocookie.com/embed/${item.id}?autoplay=1&rel=0`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen referrerPolicy="strict-origin-when-cross-origin" /> : <a
          className={styles.cover} href={item.href} target="_blank" rel="noopener noreferrer" aria-label={`Play ${item.title}`}
          onClick={event => { event.preventDefault(); onPlay(item.id); }}>
          <Image src={item.poster} alt={item.alt} fill loader={villaImageLoader} sizes={vertical ? '(max-width: 700px) 65vw, 20vw' : '(max-width: 700px) 85vw, 40vw'} />
          <span className={styles.shade} />
          <span className={`${styles.play} ${vertical ? styles.shortPlay : ''}`} aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 4v16l13-8z" /></svg></span>
          <span className={styles.caption}>{item.title}</span>
        </a>}
      </li>)}
    </ul>
    <button type="button" className={`${styles.arrow} ${styles.next}`} aria-label={`Next ${label.toLowerCase()}`} disabled={!canNext} onClick={() => go(Math.min(items.length - 1, active + 1))}><Arrow /></button>
    <div className={styles.dots} aria-label={`${label} navigation`}>
      {items.map((item, index) => <button key={item.id} type="button" aria-label={`Show ${label.toLowerCase()} ${index + 1}`} aria-current={active === index ? 'true' : undefined} onClick={() => go(index)} />)}
    </div>
  </div>;
}

export function HomeVideosSection() {
  const [playing, setPlaying] = useState<string | null>(null);
  return <section id="videos" className={`${styles.section} section-padding`} aria-labelledby="videos-heading">
    <div className={styles.heading}>
      <h2 id="videos-heading">LIT Stays on <em>film.</em></h2>
      <p>Explore our villas, amenities, and experiences through curated videos and short stories.</p>
    </div>
    <div className={styles.row}>
      <div className={styles.intro}>
        <h3>Videos</h3>
        <p>In-depth villa tours, amenities walkthroughs, and experiences.</p>
        <a className={styles.allVideos} href="https://www.youtube.com/@thelitstays/videos" target="_blank" rel="noopener noreferrer">Watch All Videos <Arrow diagonal /></a>
      </div>
      <FilmCarousel items={films} label="Videos" playing={playing} onPlay={setPlaying} />
    </div>
    <div className={styles.row}>
      <div className={styles.intro}>
        <h3>Shorts</h3>
        <p>Quick moments from<br />our stays.</p>
        <a className={`${styles.allVideos} ${styles.allShorts}`} href="https://www.youtube.com/@thelitstays/shorts" target="_blank" rel="noopener noreferrer">Watch All Shorts <Arrow diagonal /></a>
      </div>
      <FilmCarousel items={shorts} label="Shorts" vertical playing={playing} onPlay={setPlaying} />
    </div>
  </section>;
}
