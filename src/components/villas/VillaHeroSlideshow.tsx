'use client';

import Image, { getImageProps } from 'next/image';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from 'react';
import villaImageLoader from '@/lib/villa-image-loader';
import type { VillaPhoto } from '@/lib/villas';
import styles from './VillaHeroSlideshow.module.css';

export type HeroSlide = Pick<VillaPhoto, 'id' | 'src' | 'alt' | 'responsive'> & { position?: string; mobilePosition?: string; mobileSrc?: string };
const HOLD_MS = 5000;
const FADE_MS = 1200;

function subscribeVisibility(callback: () => void) {
  document.addEventListener('visibilitychange', callback);
  return () => document.removeEventListener('visibilitychange', callback);
}
function subscribeMotion(callback: () => void) {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
}

export function VillaHeroSlideshow({ name, slides, variant = 'villa' }: { name: string; slides: HeroSlide[]; variant?: 'villa' | 'home' }) {
  const [active, setActive] = useState(0);
  const [incoming, setIncoming] = useState<number | null>(null);
  const [fading, setFading] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState<number[]>([]);
  const [visible, setVisible] = useState(false);
  const frame = useRef<HTMLDivElement>(null);
  const incomingRef = useRef<number | null>(null);
  const paintFrames = useRef<number[]>([]);
  const tabVisible = useSyncExternalStore(subscribeVisibility, () => !document.hidden, () => false);
  const reduced = useSyncExternalStore(subscribeMotion, () => window.matchMedia('(prefers-reduced-motion: reduce)').matches, () => true);
  const playing = visible && tabVisible && !reduced && slides.length > 1;

  useEffect(() => {
    // The hero is pinned behind the page; its document-flow sentinel tells us
    // when scrolling content has covered it, even while the image stays pinned.
    const target = document.getElementById('nav-sentinel') || frame.current;
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .2 });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);
  useEffect(() => () => paintFrames.current.forEach(cancelAnimationFrame), []);

  const complete = useCallback(() => {
    const next = incomingRef.current;
    if (next === null) return;
    incomingRef.current = null;
    setActive(next); setIncoming(null); setFading(false);
  }, []);
  const discard = useCallback(() => {
    const next = incomingRef.current;
    if (next === null) return;
    incomingRef.current = null;
    paintFrames.current.forEach(cancelAnimationFrame);
    paintFrames.current = [];
    setFailed(current => current.includes(next) ? current : [...current, next]);
    setIncoming(null); setFading(false);
  }, []);
  const requestNext = useCallback(() => {
    if (incomingRef.current !== null) return;
    for (let step = 1; step < slides.length; step++) {
      const next = (active + step) % slides.length;
      if (failed.includes(next)) continue;
      incomingRef.current = next;
      setFading(false); setIncoming(next);
      return;
    }
  }, [active, failed, slides.length]);

  useEffect(() => {
    if (!playing || !ready || incoming !== null) return;
    const timer = setTimeout(requestNext, HOLD_MS);
    return () => clearTimeout(timer);
  }, [playing, ready, incoming, requestNext]);
  useEffect(() => {
    if (incoming === null) return;
    const timer = setTimeout(fading ? complete : discard, fading ? (reduced ? 0 : FADE_MS + 100) : 12000);
    return () => clearTimeout(timer);
  }, [incoming, fading, reduced, complete, discard]);

  async function loaded(index: number, image: HTMLImageElement) {
    try { await image.decode(); } catch { if (index === incomingRef.current) discard(); return; }
    if (index === active) setReady(true);
    if (index !== incomingRef.current) return;
    if (reduced) { complete(); return; }
    // Keep the current photo visible until the next one has decoded and painted.
    paintFrames.current = [requestAnimationFrame(() => {
      paintFrames.current.push(requestAnimationFrame(() => {
        if (incomingRef.current === index) setFading(true);
      }));
    })];
  }

  return <>
    <div ref={frame} id={`${variant}-hero-slides`} className={`${styles.slideshow}${variant === 'home' ? ' hero-photo' : ''}`}
      role="region" aria-roledescription="carousel" aria-label={`${name} hero slideshow`}
      data-active-slide={slides[active].id} data-playing={playing} aria-live="off"
      style={{ '--hero-fade-duration': `${FADE_MS}ms` } as CSSProperties}>
      {(incoming === null ? [active] : [active, incoming]).map(index => <div key={slides[index].id}
        className={`${styles.slide}${index === incoming ? ` ${styles.incoming}` : ''}${index === incoming && fading ? ` ${styles.fading}` : ''}`}
        data-hero-slide={slides[index].id} aria-hidden={index !== active}
        style={{ '--slide-position': slides[index].position || 'center', '--slide-mobile-position': slides[index].mobilePosition || slides[index].position || 'center' } as CSSProperties}
        onTransitionEnd={event => { if (event.target === event.currentTarget && event.propertyName === 'opacity' && index === incomingRef.current && fading) complete(); }}>
        <picture>
        {slides[index].mobileSrc && <source media="(max-width: 600px)" sizes="100vw" srcSet={getImageProps({ src: slides[index].mobileSrc!, width: 480, height: 854, alt: '', sizes: '100vw', loader: villaImageLoader }).props.srcSet} />}
        <Image src={slides[index].src} alt={slides[index].alt} fill sizes="(max-aspect-ratio: 3/2) 150svh, 100vw"
          loader={villaImageLoader} unoptimized={!slides[index].responsive} loading="eager"
          fetchPriority={index === 0 ? 'high' : 'auto'}
          onLoad={event => { void loaded(index, event.currentTarget); }}
          onError={() => { if (index === incomingRef.current) discard(); else { setReady(true); requestNext(); } }} />
        </picture>
      </div>)}
    </div>
  </>;
}
