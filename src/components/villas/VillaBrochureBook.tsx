'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import type { Villa } from '@/lib/villas';
import { Arrow, BrandMark } from '../ui/Icons';
import { PdfBrochure } from './PdfBrochure';
import styles from './VillaBrochureBook.module.css';

type Turn = { from: number; to: number; direction: number; key: number };
const SCROLL_TURNS = 5;

export function VillaBrochureBook({ name, brochure }: { name: string; brochure: Villa['brochure'] }) {
  const [index, setIndex] = useState(0);
  const [single, setSingle] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [turning, setTurning] = useState<Turn | null>(null);
  const [navigation, setNavigation] = useState<'scroll' | 'manual'>('manual');
  const [scrollStep, setScrollStep] = useState(0);
  const current = useRef(0);
  const singlePage = useRef(false);
  const request = useRef(0);
  const spread = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reader = useRef<HTMLDivElement>(null);
  const automaticDone = useRef(false);
  const stopAutomatic = useRef<() => void>(() => {});
  const touch = useRef<{ x: number; y: number } | null>(null);
  const source = useCallback((page: number) => `${brochure.previewBase}/page-${String(page + 1).padStart(2, '0')}.webp`, [brochure.previewBase]);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 700px)');
    function resize(event?: MediaQueryListEvent) {
      if (event) stopAutomatic.current();
      request.current++;
      singlePage.current = media.matches;
      setSingle(media.matches);
      const next = media.matches ? current.current : Math.floor(current.current / 2) * 2;
      current.current = next;
      setIndex(next);
      setTurning(null);
      setBusy(false);
    }
    resize();
    media.addEventListener('change', resize);
    return () => { media.removeEventListener('change', resize); request.current++; };
  }, []);

  useEffect(() => {
    if (!turning) return;
    const timer = setTimeout(() => setTurning(null), 950);
    return () => clearTimeout(timer);
  }, [turning]);

  // Warm only the next spread as the book approaches, rather than downloading
  // the entire brochure. Page turns use the same 3D flap as the saved homepage book.
  useEffect(() => {
    if (!spread.current) return;
    const nearby = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      const step = single ? 1 : 2;
      for (let page = index + step; page < Math.min(index + step * 2, brochure.pages); page++) {
        const image = new window.Image();
        image.src = source(page);
        void image.decode().catch(() => {});
      }
      nearby.disconnect();
    }, { rootMargin: '400px' });
    nearby.observe(spread.current);
    return () => nearby.disconnect();
  }, [index, single, brochure.pages, source]);

  const select = useCallback(async (next: number, automatic = false) => {
    if (!automatic) {
      automaticDone.current = true;
      stopAutomatic.current();
      setNavigation('manual');
    }
    const step = singlePage.current ? 1 : 2;
    const last = Math.floor((brochure.pages - 1) / step) * step;
    const target = Math.max(0, Math.min(last, Math.floor(next / step) * step));
    const key = ++request.current;
    if (target === current.current) { setBusy(false); return true; }
    setBusy(true);
    setError('');
    try {
      await Promise.all(Array.from({ length: Math.min(step, brochure.pages - target) }, async (_, offset) => {
        const image = new window.Image();
        image.src = source(target + offset);
        await image.decode();
      }));
      if (key !== request.current) return false;
      const from = current.current;
      const bounds = spread.current?.getBoundingClientRect();
      const header = document.querySelector('header')?.getBoundingClientRect().height || 80;
      // A click may scroll the bottom controls into view. Keep the whole book
      // visible as its next spread opens, including on shorter phone screens.
      if (!automatic && bounds && (bounds.top < header + 12 || bounds.bottom > window.innerHeight - 100)) {
        const top = Math.max(header + 12, header + (window.innerHeight - header - 110 - bounds.height) / 2);
        window.scrollBy({ top: bounds.top - top, behavior: 'instant' });
      }
      setTurning(window.matchMedia('(prefers-reduced-motion: reduce)').matches ? null : { from, to: target, direction: target > from ? 1 : -1, key });
      current.current = target;
      setIndex(target);
      return true;
    } catch {
      if (key === request.current) setError('This page couldn’t load. Open the PDF to keep reading.');
      return false;
    } finally {
      if (key === request.current) setBusy(false);
    }
  }, [brochure.pages, source]);

  useEffect(() => {
    const element = track.current;
    const viewer = reader.current;
    if (!element || !viewer) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let lastRequested = 0;
    let disposed = false;

    function release() {
      if (!element || !viewer) return;
      automaticDone.current = true;
      const enabled = element.dataset.scrollEnabled === 'true';
      const before = viewer.getBoundingClientRect().top;
      const documentTop = element.getBoundingClientRect().top + window.scrollY;
      element.dataset.scrollEnabled = 'false';
      setNavigation('manual');
      // Removing unused scroll distance must not move the book on screen.
      if (enabled && documentTop < window.scrollY + before) {
        window.scrollTo({ top: Math.max(0, documentTop - before), behavior: 'instant' });
      }
    }

    function measure() {
      if (!element || !viewer) return;
      const header = document.querySelector('header')?.getBoundingClientRect().height || 80;
      const height = viewer.offsetHeight;
      const turns = Math.min(SCROLL_TURNS, Math.ceil(brochure.pages / (singlePage.current ? 1 : 2)) - 1);
      const distance = Math.max(240, window.innerHeight * .5);
      element.style.setProperty('--reader-height', `${height}px`);
      element.style.setProperty('--reader-top', `${header + Math.max(8, (window.innerHeight - header - height) / 2)}px`);
      element.style.setProperty('--scroll-step-distance', `${distance}px`);
      element.style.setProperty('--scroll-distance', `${distance * turns}px`);
      if (reduced.matches || turns < 1) { release(); return; }
      if (!automaticDone.current) {
        element.dataset.scrollEnabled = 'true';
        setNavigation('scroll');
      }
    }

    function update() {
      frame = 0;
      if (!element || !viewer || automaticDone.current || element.dataset.scrollEnabled !== 'true') return;
      const bounds = element.getBoundingClientRect();
      const top = parseFloat(getComputedStyle(viewer).top) || 88;
      if (bounds.bottom <= top || bounds.top > window.innerHeight) return;
      const distance = parseFloat(element.style.getPropertyValue('--scroll-step-distance'));
      const step = singlePage.current ? 1 : 2;
      const turns = Math.min(SCROLL_TURNS, Math.ceil(brochure.pages / step) - 1);
      const next = Math.max(0, Math.min(turns, Math.floor((top - bounds.top) / distance)));
      if (next === lastRequested) return;
      lastRequested = next;
      setScrollStep(next);
      void select(next * step, true).then(success => {
        if (!disposed && !automaticDone.current && lastRequested === next && (!success || next === turns)) release();
      });
    }

    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    const onResize = () => { measure(); onScroll(); };
    const observer = new ResizeObserver(measure);
    observer.observe(viewer);
    stopAutomatic.current = release;
    measure();
    const anchorFrame = requestAnimationFrame(() => {
      const target = document.getElementById(window.location.hash.slice(1));
      if (target && element.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING) target.scrollIntoView({ behavior: 'instant', block: 'start' });
      update();
    });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    reduced.addEventListener('change', onResize);
    return () => {
      disposed = true;
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      reduced.removeEventListener('change', onResize);
      cancelAnimationFrame(frame);
      cancelAnimationFrame(anchorFrame);
      stopAutomatic.current = () => {};
    };
  }, [brochure.pages, select]);

  function onKey(event: KeyboardEvent) {
    const step = singlePage.current ? 1 : 2;
    if (event.key === 'ArrowRight') { event.preventDefault(); void select(current.current + step); }
    else if (event.key === 'ArrowLeft') { event.preventDefault(); void select(current.current - step); }
    else if (event.key === 'Home') { event.preventDefault(); void select(0); }
    else if (event.key === 'End') { event.preventDefault(); void select(brochure.pages - 1); }
  }

  function pageImage(page: number, decorative = false) {
    if (page >= brochure.pages) return <BrandMark className={styles.endMark} />;
    return <Image src={source(page)} alt={decorative ? '' : `${name} brochure, page ${page + 1} of ${brochure.pages}`} fill unoptimized loading="lazy" />;
  }

  const step = single ? 1 : 2;
  const lastVisible = Math.min(index + step, brochure.pages);
  return <section className={`${styles.section} section-padding`} id="villa-brochure" aria-labelledby="brochure-heading">
    <div className={styles.heading}><h2 id="brochure-heading">{name.replace(/^Villa /, '')},<br/><em>in print.</em></h2><PdfBrochure brochure={{ ...brochure, title: `${name} brochure` }} minimal viewLabel="Open PDF" /></div>
    <div ref={track} className={styles.track} data-navigation={navigation} data-scroll-step={scrollStep}>
    <div ref={reader} className={styles.reader}>
    <div className={styles.paper}>
      <div ref={spread} className={styles.book} data-page-mode={single ? 'single' : 'spread'} tabIndex={0} role="group" aria-label={`${name} brochure pages`} aria-busy={busy} onKeyDown={onKey} onTouchStart={event => { touch.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }} onTouchEnd={event => {
        const start = touch.current;
        touch.current = null;
        if (!start || !event.changedTouches.length) return;
        const dx = start.x - event.changedTouches[0].clientX;
        const dy = start.y - event.changedTouches[0].clientY;
        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) void select(current.current + (dx > 0 ? step : -step));
      }}>
        <div className={styles.activePages} id="brochure-active-pages">
          <div className={styles.page}>{pageImage(index)}</div>
          {!single && <div className={`${styles.page} ${styles.rightPage}`}>{pageImage(index + 1)}</div>}
        </div>
        {turning && <>
          {!single && <div className={`${styles.underPage} ${turning.direction < 0 ? styles.underRight : ''}`} aria-hidden="true">{pageImage(turning.from + (turning.direction < 0 ? 1 : 0), true)}</div>}
          <div key={turning.key} className={`${styles.turnSheet} ${turning.direction > 0 ? styles.forward : styles.backward}`} aria-hidden="true" data-page-turn onAnimationEnd={event => { if (event.target === event.currentTarget) setTurning(null); }}>
            <div className={styles.sheetFront}>{pageImage(single ? (turning.direction > 0 ? turning.from : turning.to) : (turning.direction > 0 ? turning.from + 1 : turning.to + 1), true)}</div>
            <div className={styles.sheetBack}>{pageImage(turning.direction > 0 ? turning.to : turning.from, true)}</div>
          </div>
        </>}
        <span className={styles.spine} aria-hidden="true" />
      </div>
    </div>
    <div className={styles.footer} onKeyDown={onKey}>
      <span className={styles.hint}>{navigation === 'scroll' ? `Scroll to turn · ${scrollStep}/${SCROLL_TURNS}` : 'Use the arrows or swipe.'}</span>
      <div className={styles.controls}><button type="button" aria-label="Previous brochure pages" disabled={index === 0 || busy} onClick={() => { void select(index - step); }}><Arrow className={styles.backArrow} /></button><span role="status" aria-live="polite">{busy ? 'Loading…' : `${index + 1}${lastVisible > index + 1 ? `–${lastVisible}` : ''} / ${brochure.pages}`}</span><button type="button" aria-label="Next brochure pages" disabled={lastVisible >= brochure.pages || busy} onClick={() => { void select(index + step); }}><Arrow /></button></div>
    </div>
    {error && <p className={styles.error} role="alert">{error}</p>}
    </div>
    </div>
  </section>;
}
