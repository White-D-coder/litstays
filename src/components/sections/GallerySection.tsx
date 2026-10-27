'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { photos } from '@/lib/site-content';
import { Arrow } from '../ui/Icons';
import { Reveal } from '../ui/Reveal';

export function GallerySection() {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const swipe = useRef<number | null>(null);
  const move = useCallback((step: number) => setIndex(current => (current + step + photos.length) % photos.length), []);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    function onKey(event: KeyboardEvent) {
      if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
    }
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = previous; document.removeEventListener('keydown', onKey); };
  }, [open, move]);
  function show(i: number, element: HTMLElement) { trigger.current = element; setIndex(i); dialog.current?.showModal(); setOpen(true); }
  function close() { dialog.current?.close(); setOpen(false); trigger.current?.focus(); }
  return <section className="gallery section-padding" id="gallery" aria-labelledby="gallery-heading">
    <div className="gallery-heading-row">
      <Reveal className="gallery-heading"><p className="eyebrow">THE PHOTO JOURNAL</p><h2 id="gallery-heading">Wish <em>you were here.</em></h2></Reveal>
      <Reveal className="gallery-introduction" delay={.08}><p>Little corners. Longer evenings.<br />A few things to look forward to.</p><button className="text-link dark-link" onClick={event => show(0, event.currentTarget)}>View all photographs <span className="photo-count">{photos.length.toString().padStart(2, '0')}</span><Arrow diagonal /></button></Reveal>
    </div>
    <div className="gallery-mosaic">
      {[photos[3], photos[4], photos[6]].map((photo, i) => <Reveal key={photo.id} className={i === 0 ? 'gallery-feature' : 'gallery-supporting'} delay={i * .07}>
        <button className={`gallery-item ${i === 0 ? 'gallery-item-featured' : 'gallery-item-compact'}`} onClick={event => show(photos.indexOf(photo), event.currentTarget)}>
          <span className="gallery-image image-frame">
            <Image src={`${photo.id}.jpg`} alt={photo.alt} fill sizes={i === 0 ? '(max-width: 700px) 100vw, 55vw' : '(max-width: 700px) 45vw, 38vw'} />
            {i === 0 && <><span className="gallery-image-shade" /><span className="gallery-feature-caption"><span>{photo.category}</span><span>{photo.caption}<em>Some places feel like a beginning.</em></span></span></>}
            <span className="gallery-expand"><Arrow diagonal /></span>
          </span>
          {i !== 0 && <span className="gallery-tile-caption"><span>{photo.caption}</span><span>0{i + 1}</span></span>}
        </button>
      </Reveal>)}
    </div>
    <dialog className="lightbox" ref={dialog} aria-label="Property photo gallery" onCancel={close} onClose={() => setOpen(false)}><div className="lightbox-header"><span>THE LIT STAYS <span className="lightbox-divider">/</span> VILLA ARCHWAY</span><button onClick={close} autoFocus aria-label="Close photo gallery">Close <span aria-hidden="true">×</span></button></div><div className="lightbox-image" onTouchStart={event => { swipe.current = event.touches[0].clientX; }} onTouchEnd={event => { if (swipe.current === null) return; const difference = swipe.current - event.changedTouches[0].clientX; if (Math.abs(difference) > 45) move(difference > 0 ? 1 : -1); swipe.current = null; }}>{open && <Image key={photos[index].id} src={`${photos[index].id}.jpg`} alt={photos[index].alt} fill sizes="90vw"/>}</div><div className="lightbox-bottom"><div aria-live="polite"><span className="eyebrow">{photos[index].category}</span><p>{photos[index].caption}</p></div><div className="lightbox-controls"><button onClick={() => move(-1)} aria-label="Previous photograph"><Arrow className="arrow-back"/></button><span>{(index + 1).toString().padStart(2, '0')} / {photos.length.toString().padStart(2, '0')}</span><button onClick={() => move(1)} aria-label="Next photograph"><Arrow/></button></div></div></dialog>
  </section>;
}
