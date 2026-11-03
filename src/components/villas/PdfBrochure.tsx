'use client';

import { useEffect, useRef, useState } from 'react';
import { Arrow } from '../ui/Icons';
import styles from './PdfBrochure.module.css';

export type Brochure = { title: string; href: string; filename: string };

export function PdfBrochure({ brochure, dark = false, minimal = false, viewLabel = 'View brochure', downloadLabel = 'Download' }: {
  brochure: Brochure; dark?: boolean; minimal?: boolean; viewLabel?: string; downloadLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [open]);
  function close() { dialog.current?.close(); setOpen(false); trigger.current?.focus({ preventScroll: true }); }

  return <div className={styles.actions} data-theme={dark ? 'dark' : 'light'} data-appearance={minimal ? 'minimal' : 'button'}>
    <button ref={trigger} type="button" className={styles.view} onClick={() => { dialog.current?.showModal(); setOpen(true); }} aria-label={`View ${brochure.title}`}>
      {viewLabel}<Arrow diagonal />
    </button>
    <a href={brochure.href} download={brochure.filename} className={styles.download} aria-label={`Download ${brochure.title}`}>
      {downloadLabel}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true"><path d="M12 3v12m-5-5 5 5 5-5M5 17v4h14v-4" /></svg>
    </a>
    <dialog ref={dialog} className={styles.dialog} aria-label={brochure.title} onCancel={event => { event.preventDefault(); close(); }} onClose={() => { setOpen(false); trigger.current?.focus({ preventScroll: true }); }}>
      <div className={styles.header}><div><span>THE LIT STAYS</span><h2>{brochure.title}</h2></div><div className={styles.tools}>
        <a href={brochure.href} download={brochure.filename}>Download PDF <span aria-hidden="true">↓</span></a>
        <button autoFocus type="button" onClick={close} aria-label={`Close ${brochure.title}`}>Close <span aria-hidden="true">×</span></button>
      </div></div>
      {open && <iframe title={brochure.title} src={`${brochure.href}#view=FitH`} className={styles.pdf} />}
      <div className={styles.footer}><span>Prefer a full-screen view?</span><a href={brochure.href} target="_blank" rel="noopener noreferrer">Open PDF in a new tab <Arrow diagonal /></a></div>
    </dialog>
    <noscript><a href={brochure.href} target="_blank" rel="noopener noreferrer">Open {brochure.title}</a></noscript>
  </div>;
}
