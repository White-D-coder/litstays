'use client';

import { useState } from 'react';
import { Arrow } from '../ui/Icons';
import styles from './HomeVideosSection.module.css';
import { FilmPreviewCard, type Film } from './FilmPreviewCard';

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
function FilmGrid({ items, label, vertical, playing, onPlay }: {
  items: Film[]; label: string; vertical?: boolean; playing: string | null; onPlay: (id: string | null) => void;
}) {
  return <ul className={`${styles.track} ${vertical ? styles.shortsTrack : ''}`} aria-label={`LIT Stays ${label.toLowerCase()}`}>
    {items.map(item => <FilmPreviewCard key={item.id} item={item} vertical={vertical} active={playing === item.id}
      onActivate={() => onPlay(item.id)} onLeave={() => onPlay(null)} />)}
  </ul>;
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
      <FilmGrid items={films} label="Videos" playing={playing} onPlay={setPlaying} />
    </div>
    <div className={styles.row}>
      <div className={styles.intro}>
        <h3>Shorts</h3>
        <p>Quick moments from<br />our stays.</p>
        <a className={`${styles.allVideos} ${styles.allShorts}`} href="https://www.youtube.com/@thelitstays/shorts" target="_blank" rel="noopener noreferrer">Watch All Shorts <Arrow diagonal /></a>
      </div>
      <FilmGrid items={shorts} label="Shorts" vertical playing={playing} onPlay={setPlaying} />
    </div>
  </section>;
}
