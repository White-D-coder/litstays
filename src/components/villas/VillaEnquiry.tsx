'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { site } from '@/lib/site-content';
import { dateInZone } from '@/lib/availability-rules';
import { formatRupees, type Villa } from '@/lib/villas';
import { Arrow } from '../ui/Icons';
import styles from './VillaDetail.module.css';

export function VillaEnquiry({ villa }: { villa: Villa }) {
  const [today, setToday] = useState('');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const preview = useRef<HTMLTextAreaElement>(null);
  useEffect(() => setToday(dateInZone(Date.now(), 'Asia/Kolkata')), []);

  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get('name') || '').trim();
    const guests = Number(data.get('guests'));
    const date = String(data.get('date') || '');
    if (!name) { setError('Please enter your name.'); return; }
    if (!Number.isSafeInteger(guests) || guests < 1) { setError('Please enter a whole number of guests.'); return; }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date < dateInZone(Date.now(), 'Asia/Kolkata')) { setError('Please choose a date from today onwards.'); return; }
    const formattedDate = new Intl.DateTimeFormat('en-IN', { dateStyle: 'long', timeZone: 'Asia/Kolkata' }).format(new Date(`${date}T12:00:00+05:30`));
    setError(''); setCopied(false);
    const pricing = [
      villa.stayPrice !== undefined ? `Stay quotation: ${formatRupees(villa.stayPrice)}` : 'Please share the stay quotation for our dates.',
      villa.refundableDeposit !== undefined ? `Extra refundable deposit: ${formatRupees(villa.refundableDeposit)} (refundable on checkout)` : '',
      villa.priceIncludes || '',
    ].filter(Boolean).join('\n');
    const food = villa.food ? `\n\nOptional in-house food: ${formatRupees(villa.food.minPrice)}–${formatRupees(villa.food.maxPrice)} per person, including ${villa.food.meals.join(', ').toLowerCase()}.` : '';
    setMessage(`Hello The Lit Stays, I’d like to enquire about ${villa.name} — ${villa.bedrooms}BHK ${villa.style}.\n\nName: ${name}\nPeople: ${guests}\nPreferred date: ${formattedDate}\nLocation: ${villa.location}\nPool: ${villa.hasPool ? 'Swimming pool' : 'Without pool'}\n\n${pricing}${food}\n\nPlease confirm availability and the quotation for our group and date. Thank you!`);
    requestAnimationFrame(() => preview.current?.focus());
  }

  async function copy() {
    try { await navigator.clipboard.writeText(message); setCopied(true); }
    catch { preview.current?.focus(); preview.current?.select(); setError('Please copy the selected message and send it to us on Instagram.'); }
  }

  return <section id="enquire" className={`${styles.enquiry} section-padding`} aria-labelledby="villa-enquiry-heading">
    <div className={styles.enquiryIntro}><p className="eyebrow">GOOD STAYS BEGIN WITH A CONVERSATION</p><h2 id="villa-enquiry-heading">Let’s make<br/><em>a little room.</em></h2><p>Tell us who’s coming and when. We’ll help you plan your {villa.name} stay.</p><div className={styles.signature}><span>Warmly,</span><strong>{villa.host.name}</strong><span>{villa.host.role} · The LIT Stays</span></div></div>
    <div className={styles.enquiryForm}>
      <div className={styles.enquiryFormHeading}><p className="eyebrow">YOUR NEXT ESCAPE</p><h3>{villa.name}</h3></div>
      <noscript><p>Tell us your name, preferred date and group size on Instagram to enquire about {villa.name}.</p><a className="button button-ivory" href={site.instagramMessage}>Enquire on Instagram <Arrow diagonal /></a></noscript>
      <form onSubmit={prepare}>
        <label>Your name<input name="name" autoComplete="name" placeholder="What should we call you?" maxLength={100} required /></label>
        <div className={styles.formRow}><label>Number of guests<input name="guests" type="number" inputMode="numeric" min={1} step={1} placeholder="Your good company" required /></label><label>Preferred date<input name="date" type="date" min={today || undefined} required /></label></div>
        <p className={styles.formNote}>For {villa.name} · {villa.bedrooms}BHK {villa.style} · {villa.location}</p>
        <button className="button button-green" type="submit">Prepare my enquiry <Arrow diagonal /></button>
      </form>
      <p role="alert" className={styles.error}>{error}</p>
      {message && <div className={styles.message}>
        <label htmlFor="villa-enquiry-message">Your enquiry for {villa.name}</label>
        <textarea id="villa-enquiry-message" ref={preview} value={message} readOnly rows={12} />
        <div className={styles.messageActions}><button type="button" onClick={copy} className="button button-green">{copied ? 'Message copied' : 'Copy enquiry'}</button><a className="text-link" href={site.instagramMessage} target="_blank" rel="noopener noreferrer">Send on Instagram <Arrow diagonal /></a></div>
        <p className={styles.formNote} role="status">{copied ? 'Copied. Paste your enquiry into Instagram to send it.' : 'Copy your enquiry and send it to us on Instagram.'}</p>
      </div>}
    </div>
  </section>;
}
