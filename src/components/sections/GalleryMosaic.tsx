'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from 'react';
import { galleryScenes, galleryMotion } from '@/lib/gallery-slides';
import { photos } from '@/lib/site-content';
import { Arrow } from '../ui/Icons';
import { Reveal } from '../ui/Reveal';

function subscribeVisibility(callback: () => void) {
  document.addEventListener('visibilitychange', callback);
  return () => document.removeEventListener('visibilitychange', callback);
}
function subscribeReducedMotion(callback: () => void) {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
}

export function GalleryMosaic({ paused, onSelect }: { paused: boolean; onSelect: (index: number, trigger: HTMLElement) => void }) {
  const [active, setActive] = useState(0);
  const [incoming, setIncoming] = useState<number | null>(null);
  const [fading, setFading] = useState(false);
  const [ready, setReady] = useState<string[]>([]);
  const [failed, setFailed] = useState<number[]>([]);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const frame = useRef<HTMLDivElement>(null);
  const incomingRef = useRef<number | null>(null);
  const paints = useRef<number[]>([]);
  const tabVisible = useSyncExternalStore(subscribeVisibility, () => !document.hidden, () => false);
  const reduced = useSyncExternalStore(subscribeReducedMotion, () => window.matchMedia('(prefers-reduced-motion: reduce)').matches, () => true);

  useEffect(() => {
    let layout = Math.floor(Math.random() * 3);
    try {
      const previous = sessionStorage.getItem('lit-journal-layout');
      if (previous !== null) layout = (Number(previous) + 1) % 3;
      sessionStorage.setItem('lit-journal-layout', String(layout));
    } catch { /* The gallery still works when browser storage is unavailable. */ }
    if (frame.current) frame.current.dataset.layout = String(layout);
  }, []);

  useEffect(() => {
    if (!frame.current || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .1 });
    observer.observe(frame.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => () => paints.current.forEach(cancelAnimationFrame), []);

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
    paints.current.forEach(cancelAnimationFrame);
    setFailed(current => current.includes(next) ? current : [...current, next]);
    setIncoming(null); setFading(false);
  }, []);
  const requestNext = useCallback(() => {
    if (incomingRef.current !== null) return;
    let next = (active + 1) % galleryScenes.length;
    while (failed.includes(next) && next !== active) next = (next + 1) % galleryScenes.length;
    if (next === active) return;
    incomingRef.current = next;
    setReady(current => current.filter(key => !key.startsWith(`${next}-`)));
    setFading(false); setIncoming(next);
  }, [active, failed]);

  const playing = visible && tabVisible && !reduced && !paused && !hovered && !focused;
  useEffect(() => {
    if (!playing || incoming !== null || !galleryScenes[active].photos.every((_, slot) => ready.includes(`${active}-${slot}`))) return;
    const timer = setTimeout(requestNext, galleryMotion.holdMs);
    return () => clearTimeout(timer);
  }, [playing, incoming, active, ready, requestNext]);
  useEffect(() => {
    if (incoming === null || fading || !galleryScenes[incoming].photos.every((_, slot) => ready.includes(`${incoming}-${slot}`))) return;
    // Paint all six decoded replacement images before fading the scene in.
    paints.current = [requestAnimationFrame(() => {
      paints.current.push(requestAnimationFrame(() => {
        if (incomingRef.current === incoming) setFading(true);
      }));
    })];
    return () => paints.current.forEach(cancelAnimationFrame);
  }, [incoming, fading, ready]);
  useEffect(() => {
    if (incoming === null) return;
    const timer = setTimeout(fading ? complete : discardIncoming, fading ? (reduced ? 0 : galleryMotion.crossfadeMs + 100) : galleryMotion.imageTimeoutMs);
    return () => clearTimeout(timer);
  }, [incoming, fading, reduced, complete, discardIncoming]);

  function onLoaded(scene: number, slot: number) {
    const key = `${scene}-${slot}`;
    setReady(current => current.includes(key) ? current : [...current, key]);
  }

  const displayed = incoming === null ? [active] : [active, incoming];
  return <div ref={frame} className={`gallery-mosaic gallery-journal${fading ? ' is-transitioning' : ''}`} data-scene={active} data-playing={playing}
    style={{ '--journal-crossfade': `${galleryMotion.crossfadeMs}ms` } as CSSProperties}
    onPointerEnter={event => { if (event.pointerType === 'mouse') setHovered(true); }}
    onPointerLeave={() => setHovered(false)}
    onFocusCapture={() => setFocused(true)}
    onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false); }}>
    {[0, 1, 2, 3, 4, 5].map(slot => {
      const current = galleryScenes[active].photos[slot];
      return <Reveal key={slot} className={`journal-tile-${slot} ${slot === 0 ? 'gallery-feature' : 'gallery-supporting'}`} delay={slot * .04}>
        <button className={`gallery-item ${slot === 0 ? 'gallery-item-featured' : 'gallery-item-compact'}`}
          aria-label={`Open photograph: ${current.caption}`} data-photo={current.id}
          onClick={event => onSelect(photos.indexOf(current), event.currentTarget)}>
          <span className="gallery-image image-frame">
            {displayed.map(scene => {
              const photo = galleryScenes[scene].photos[slot];
              const isIncoming = scene === incoming;
              return <span key={scene} aria-hidden={isIncoming}
                className={`gallery-journal-slide${isIncoming ? ' is-incoming' : ''}${isIncoming && fading ? ' is-fading' : ''}`}
                onTransitionEnd={event => { if (event.target === event.currentTarget && event.propertyName === 'opacity' && isIncoming && fading) complete(); }}>
                <Image src={`${photo.id}.jpg`} alt={photo.alt} fill sizes="(max-width: 700px) 48vw, 40vw" loading={isIncoming ? 'eager' : 'lazy'}
                  onLoad={() => onLoaded(scene, slot)} onError={() => { if (isIncoming) discardIncoming(); }} />
                <span className="gallery-photo-wash" />
                <span className="gallery-image-shade" />
                <span className="gallery-journal-caption"><span className="gallery-journal-category">{photo.category}</span><span className="gallery-journal-title">{photo.caption}</span>{slot === 0 && <em>{galleryScenes[scene].note}</em>}</span>
              </span>;
            })}
            <span className="gallery-expand" aria-hidden="true"><Arrow diagonal /></span>
          </span>
        </button>
      </Reveal>;
    })}
  </div>;
}
