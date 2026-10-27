'use client';

import { useEffect, useRef, type ReactNode } from 'react';

// Preserves the supplied HomeFAQMore behavior: four initial questions,
// manual desktop expansion, and directional scroll expansion on phones.
export function FAQMore({ children }: { children: ReactNode }) {
  const disclosure = useRef<HTMLDetailsElement>(null);
  const openedByClick = useRef(false);

  useEffect(() => {
    const element = disclosure.current;
    if (!element) return;
    const phone = window.matchMedia('(max-width: 640px)');
    let lastY = Math.max(0, window.scrollY);
    let frame: number | undefined;
    let nearby = !('IntersectionObserver' in window);
    const observer = 'IntersectionObserver' in window ? new IntersectionObserver(([entry]) => { nearby = entry.isIntersecting; }) : null;
    observer?.observe(element);

    const update = () => {
      frame = undefined;
      const y = Math.max(0, window.scrollY);
      const delta = y - lastY;
      if (Math.abs(delta) < 8) return;
      lastY = y;
      if (!phone.matches || !nearby) return;
      const top = element.getBoundingClientRect().top;
      if (top < 0 || top > window.innerHeight) return;
      if (delta > 0 && top <= window.innerHeight * .75 && !element.open) {
        const summaryFocused = document.activeElement === element.querySelector('summary');
        openedByClick.current = false;
        element.open = true;
        if (summaryFocused) element.querySelector<HTMLElement>('.lit-faq-item > summary')?.focus({ preventScroll: true });
      } else if (delta < 0 && element.open) {
        const restoreFocus = element.contains(document.activeElement);
        element.open = false;
        if (restoreFocus) element.querySelector('summary')?.focus({ preventScroll: true });
      }
    };
    const scroll = () => { if (frame === undefined) frame = window.requestAnimationFrame(update); };
    const configure = () => {
      window.removeEventListener('scroll', scroll);
      if (frame !== undefined) window.cancelAnimationFrame(frame);
      frame = undefined; lastY = Math.max(0, window.scrollY);
      if (phone.matches) window.addEventListener('scroll', scroll, { passive: true });
    };
    configure(); phone.addEventListener('change', configure);
    return () => { window.removeEventListener('scroll', scroll); phone.removeEventListener('change', configure); observer?.disconnect(); if (frame !== undefined) window.cancelAnimationFrame(frame); };
  }, []);

  return <details ref={disclosure} className="lit-faq-more" onToggle={event => {
    if (event.target !== event.currentTarget) return;
    if (event.currentTarget.open && openedByClick.current) event.currentTarget.querySelector<HTMLElement>('.lit-faq-item > summary')?.focus({ preventScroll: true });
    openedByClick.current = false;
  }}>
    <summary className="lit-faq-more-summary" onClick={() => { openedByClick.current = !disclosure.current?.open; }}><span>More questions</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></summary>
    {children}
  </details>;
}
