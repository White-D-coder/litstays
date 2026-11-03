'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { VillaPhoto } from '@/lib/villas';
import villaImageLoader from '@/lib/villa-image-loader';
import { Arrow } from '../ui/Icons';
import { Reveal } from '../ui/Reveal';
import styles from './VillaGallery.module.css';

export function VillaGallery({ name, photos }: { name: string; photos: VillaPhoto[] }) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const thumbnails = useRef<HTMLDivElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const move = useCallback((step: number) => setIndex(current => (current + step + photos.length) % photos.length), [photos.length]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    function onKey(event: KeyboardEvent) {
      if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
      else if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
      else if (event.key === 'Home') { event.preventDefault(); setIndex(0); }
      else if (event.key === 'End') { event.preventDefault(); setIndex(photos.length - 1); }
    }
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = previous; document.removeEventListener('keydown', onKey); };
  }, [open, move, photos.length]);

  useEffect(() => {
    if (open) thumbnails.current?.querySelector<HTMLElement>(`[data-photo-index="${index}"]`)?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'instant' });
  }, [open, index]);

  function show(next: number, element: HTMLElement) {
    trigger.current = element;
    setIndex(next);
    dialog.current?.showModal();
    setOpen(true);
  }
  function close() {
    dialog.current?.close();
    setOpen(false);
    trigger.current?.focus({ preventScroll: true });
  }

  if (!photos.length) return null;
  const active = photos[index];
  return <section id="villa-photos" className={`${styles.section} section-padding`} aria-labelledby="villa-gallery-heading">
    <div className={styles.heading}>
      <h2 id="villa-gallery-heading">Picture yourself <em>here.</em></h2>
      <div className={styles.galleryNote}><button className="text-link" onClick={event => show(0, event.currentTarget)}>View all {photos.length} photos <Arrow diagonal /></button></div>
    </div>
    <div className={styles.mosaic}>{photos.slice(0, 5).map((photo, position) => <Reveal key={photo.id} className={`${styles.tile} ${position === 0 ? styles.featured : ''}`} delay={position * .04}>
      <button className={styles.photoButton} aria-label={`Open photograph: ${photo.caption}`} onClick={event => show(position, event.currentTarget)}>
        <span className={styles.photo}><Image src={photo.src} alt={photo.alt} fill loader={villaImageLoader} unoptimized={!photo.responsive} sizes={position === 0 ? '(max-width: 900px) 100vw, 65vw' : '(max-width: 900px) 46vw, 33vw'} /><span className={styles.expand} aria-hidden="true"><Arrow diagonal /></span></span>
        <span className={styles.caption}><span>{photo.caption}</span><span aria-hidden="true">{String(position + 1).padStart(2, '0')}</span></span>
      </button>
    </Reveal>)}</div>

    <dialog ref={dialog} className={styles.dialog} aria-label={`${name} photo gallery`} onCancel={event => { event.preventDefault(); close(); }} onClose={() => setOpen(false)}>
      <div className={styles.dialogHeader}><span>THE LIT STAYS <span className={styles.divider}>/</span> {name}</span><button autoFocus onClick={close} aria-label="Close villa photo gallery">Close <span aria-hidden="true">×</span></button></div>
      <div className={styles.viewerImage} onTouchStart={event => { touch.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }} onTouchEnd={event => {
        const start = touch.current;
        touch.current = null;
        if (!start || !event.changedTouches.length) return;
        const dx = start.x - event.changedTouches[0].clientX;
        const dy = start.y - event.changedTouches[0].clientY;
        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? 1 : -1);
      }}>
        {open && <Image key={active.id} src={active.src} alt={active.alt} fill loader={villaImageLoader} unoptimized={!active.responsive} sizes="(max-width: 700px) 100vw, 90vw" loading="eager" />}
      </div>
      <div className={styles.viewerFooter}>
        <div className={styles.activeCaption} aria-live="polite"><span>{active.category}</span><p>{active.caption}</p></div>
        <div className={styles.controls}><button aria-label="Previous villa photograph" onClick={() => move(-1)}><Arrow className={styles.backArrow} /></button><span aria-live="polite">{String(index + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}</span><button aria-label="Next villa photograph" onClick={() => move(1)}><Arrow /></button></div>
      </div>
      <div ref={thumbnails} className={styles.thumbnails} aria-label="Choose a photograph">{open && photos.map((photo, position) => <button key={photo.id} data-photo-index={position} aria-label={`View photograph ${position + 1}: ${photo.caption}`} aria-current={index === position ? 'true' : undefined} onClick={() => setIndex(position)}>
        <Image src={photo.src} alt="" fill loader={villaImageLoader} unoptimized={!photo.responsive} sizes="64px" /><span aria-hidden="true">{String(position + 1).padStart(2, '0')}</span>
      </button>)}</div>
    </dialog>
  </section>;
}
