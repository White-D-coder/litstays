'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from 'react';
import { introSlides, introSlideshow } from '@/lib/intro-slides';

function subscribeVisibility(callback: () => void) {
  document.addEventListener('visibilitychange', callback);
  return () => document.removeEventListener('visibilitychange', callback);
}
function subscribeReducedMotion(callback: () => void) {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
}

export function IntroSlideshow() {
  const [active, setActive] = useState(0);
  const [incoming, setIncoming] = useState<number | null>(null);
  const [fading, setFading] = useState(false);
  const [ready, setReady] = useState<number[]>([]);
  const [failed, setFailed] = useState<number[]>([]);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const frame = useRef<HTMLDivElement>(null);
  const incomingRef = useRef<number | null>(null);
  const paintFrames = useRef<number[]>([]);
  const tabVisible = useSyncExternalStore(subscribeVisibility, () => !document.hidden, () => false);
  const reduced = useSyncExternalStore(subscribeReducedMotion, () => window.matchMedia('(prefers-reduced-motion: reduce)').matches, () => true);

  useEffect(() => {
    if (!frame.current || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .2 });
    observer.observe(frame.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => () => paintFrames.current.forEach(cancelAnimationFrame), []);

  const complete = useCallback(() => {
    const next = incomingRef.current;
    if (next === null) return;
    incomingRef.current = null;
    setActive(next); setIncoming(null); setFading(false);
  }, []);
  const discardIncoming = useCallback(() => {
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
    let next = (active + 1) % introSlides.length;
    while (failed.includes(next) && next !== active) next = (next + 1) % introSlides.length;
    if (next === active) return;
    incomingRef.current = next;
    setFading(false); setIncoming(next);
  }, [active, failed]);

  const playing = visible && tabVisible && !reduced && !hovered;
  useEffect(() => {
    if (!playing || incoming !== null || !ready.includes(active)) return;
    const timer = setTimeout(requestNext, introSlideshow.holdMs);
    return () => clearTimeout(timer);
  }, [playing, incoming, active, ready, requestNext]);
  useEffect(() => {
    if (incoming === null) return;
    const timer = setTimeout(fading ? complete : discardIncoming, fading ? (reduced ? 0 : introSlideshow.crossfadeMs + 100) : introSlideshow.imageTimeoutMs);
    return () => clearTimeout(timer);
  }, [incoming, fading, reduced, complete, discardIncoming]);

  function onLoaded(index: number) {
    setReady(current => current.includes(index) ? current : [...current, index]);
    if (index !== incomingRef.current) return;
    if (reduced) { complete(); return; }
    // Allow a fully decoded incoming image to paint at opacity zero first.
    // The current image stays visible underneath throughout the crossfade.
    paintFrames.current = [requestAnimationFrame(() => {
      paintFrames.current.push(requestAnimationFrame(() => {
        if (incomingRef.current === index) setFading(true);
      }));
    })];
  }

  const displayed = incoming === null ? [active] : [active, incoming];
  return <div
    ref={frame}
    className="intro-portrait-image image-frame intro-slideshow"
    role="region"
    aria-roledescription="carousel"
    aria-label="Villa Archway photo slideshow"
    data-active-slide={introSlides[active].id}
    data-playing={playing}
    style={{ '--intro-crossfade-duration': `${introSlideshow.crossfadeMs}ms` } as CSSProperties}
    onPointerEnter={event => { if (event.pointerType === 'mouse') setHovered(true); }}
    onPointerLeave={() => setHovered(false)}
  >
    <div className="intro-slide-track" aria-live="off">
      {displayed.map(index => <div
        key={introSlides[index].id}
        className={`intro-slide-layer${index === incoming ? ' is-incoming' : ''}${index === incoming && fading ? ' is-fading' : ''}`}
        role="group"
        aria-roledescription="slide"
        aria-label={`${index + 1} of ${introSlides.length}`}
        aria-hidden={index !== active}
        onTransitionEnd={event => { if (event.target === event.currentTarget && event.propertyName === 'opacity' && index === incomingRef.current && fading) complete(); }}
      >
        <Image className="intro-slide-image" src={`${introSlides[index].id}.jpg`} alt={introSlides[index].alt} fill sizes="(max-width: 800px) 85vw, 40vw" loading={index === incoming ? 'eager' : 'lazy'} onLoad={() => onLoaded(index)} onError={() => { if (index === incomingRef.current) discardIncoming(); }} />
      </div>)}
    </div>
  </div>;
}
