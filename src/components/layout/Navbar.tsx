'use client';

import { useEffect, useRef, useState } from 'react';
import { navigation } from '@/lib/site-content';
import { Arrow, BrandMark } from '../ui/Icons';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const sentinel = document.querySelector('#nav-sentinel');
    if (!sentinel) return;
    const observer = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting), { rootMargin: '-105px 0px 0px 0px' });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [open]);
  function close() { dialog.current?.close(); setOpen(false); toggle.current?.focus(); }
  return <>
    <header className={`navbar ${scrolled ? 'is-scrolled' : ''}`}>
      <a className="wordmark" href="#home"><BrandMark /><span>the lit stays<span className="wordmark-sub" aria-hidden="true">A LITTLE CLOSER TO YOURSELF</span></span></a>
      <nav className="desktop-navigation" aria-label="Main navigation">{navigation.map(link => <a href={link.href} key={link.href}>{link.label}</a>)}</nav>
      <a className="nav-enquire" href="#enquire">Plan your stay <Arrow diagonal /></a>
      <button className="menu-toggle" ref={toggle} aria-label="Open navigation menu" aria-expanded={open} aria-controls="mobile-menu" onClick={() => { dialog.current?.showModal(); setOpen(true); }}><span/><span/></button>
    </header>
    <dialog id="mobile-menu" className="mobile-menu" ref={dialog} aria-label="Site navigation" onCancel={close} onClose={() => setOpen(false)}>
      <div className="menu-top"><span className="serif">the lit stays</span><button autoFocus aria-label="Close navigation menu" onClick={close}>Close <span aria-hidden="true">×</span></button></div>
      <p className="eyebrow">YOUR OWN LITTLE ESCAPE</p>
      <nav aria-label="Mobile navigation">{navigation.map((link, i) => <a href={link.href} key={link.href} onClick={close}><span>0{i + 1}</span>{link.label}<Arrow diagonal/></a>)}<a href="#enquire" onClick={close}><span>04</span>Plan your stay<Arrow diagonal/></a></nav>
      <p className="menu-bottom">Some places stay with you.</p>
    </dialog>
  </>;
}
