'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { site } from '@/lib/site-content';
import { Arrow, BrandMark } from '../ui/Icons';
import { Reveal } from '../ui/Reveal';
import { useStay } from '../availability/StayProvider';
import { fetchAvailability, availabilityMode } from '@/lib/availability-client';
import { dateInZone, stayError } from '@/lib/availability-rules';

type Enquiry = { name: string; contact: string; checkIn: string; checkOut: string; guests: string; message: string };

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${value}T12:00:00`));
}
function enquiryMessage(data: Enquiry) {
  return `Hello The Lit Stays, I’d love to enquire about Villa Archway.${availabilityMode === 'demo' ? '\nI selected these dates in the preview calendar; please confirm actual availability.' : ''}\n\nName: ${data.name}\nContact: ${data.contact}\nCheck-in: ${formatDate(data.checkIn)}\nCheck-out: ${formatDate(data.checkOut)}\nGuests: ${data.guests}${data.message ? `\n\n${data.message}` : ''}\n\nPlease share availability, pricing and any details for our stay. Thank you!`;
}

export function BookingSection() {
  const { dates, setDates } = useStay();
  const { checkIn, checkOut } = dates;
  const setCheckIn = (value: string) => setDates(current => ({ ...current, checkIn: value }));
  const setCheckOut = (value: string) => setDates(current => ({ ...current, checkOut: value }));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState<Enquiry | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copying, setCopying] = useState(false);
  const form = useRef<HTMLFormElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const submit = useRef<HTMLButtonElement>(null);
  const preview = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (!reviewOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [reviewOpen]);
  function close() { dialog.current?.close(); setReviewOpen(false); submit.current?.focus(); }
  async function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const values = Object.fromEntries(new FormData(event.currentTarget)) as Enquiry;
    values.name = values.name.trim();
    values.contact = values.contact.trim();
    values.message = values.message.trim();
    if (!values.name) { setError('Please tell us your name.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.contact) && !/^\+?[\d\s().-]{7,22}$/.test(values.contact)) { setError('Please enter a valid email address or phone number.'); form.current?.querySelector<HTMLInputElement>('[name="contact"]')?.focus(); return; }
    if (values.checkOut <= values.checkIn) { setError('Check-out needs to be after your check-in date.'); return; }
    if (!Number.isInteger(Number(values.guests)) || Number(values.guests) < 1) { setError('Please enter a whole number of guests, starting from one.'); return; }
    if (Number(values.guests) > site.propertyDetails.guestCapacity) { setError(`Villa Archway accommodates up to ${site.propertyDetails.guestCapacity} guests.`); return; }
    setSubmitting(true);
    try {
      const availability = await fetchAvailability(values.checkIn, values.checkOut, { fresh: true });
      if (values.checkIn < dateInZone(Date.now(), availability.timeZone)) { setError('Please choose a check-in date from today onwards.'); return; }
      const conflict = stayError(values.checkIn, values.checkOut, availability.unavailable, availability.minStayNights);
      if (conflict) { setError(conflict); return; }
      setData(values); setCopied(false); setReviewOpen(true); dialog.current?.showModal();
    } catch { setError('We can’t verify these dates right now. Please try again or contact us on Instagram.'); }
    finally { setSubmitting(false); }
  }
  async function copyMessage() {
    if (!data) return;
    setCopying(true);
    try { await navigator.clipboard.writeText(enquiryMessage(data)); setCopied(true); }
    catch { preview.current?.focus(); preview.current?.select(); setCopied(false); }
    finally { setCopying(false); }
  }
  const text = data ? enquiryMessage(data) : '';
  const destination = site.contact.whatsapp
    ? `https://wa.me/${site.contact.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`
    : site.contact.email
      ? `mailto:${site.contact.email}?subject=${encodeURIComponent('Villa Archway stay enquiry')}&body=${encodeURIComponent(text)}`
      : site.instagramMessage;
  const channel = site.contact.whatsapp ? 'WhatsApp' : site.contact.email ? 'email' : 'Instagram';
  return <section className="booking section-padding" id="enquire" aria-labelledby="booking-heading"><div className="booking-intro"><Reveal><p className="eyebrow">SOMETHING TO LOOK FORWARD TO</p><h2 id="booking-heading">Your next escape<br/>starts <em>here.</em></h2><p>A few days away. Your favourite people.<br/>Tell us what you have in mind.</p><div className="booking-signature"><BrandMark/><span>Good stays begin<br/>with a conversation.</span></div></Reveal></div><Reveal className="booking-form-wrap"><noscript><style>{`.booking-form { display: none; }`}</style><p>Tell us your dates and group size on Instagram to enquire about your stay.</p><a className="button button-ivory" href={site.instagramMessage}>Enquire on Instagram <Arrow diagonal/></a></noscript><form ref={form} onSubmit={prepare} className="booking-form"><div className="form-row"><label>Your name<input name="name" autoComplete="name" placeholder="What should we call you?" maxLength={100} required/></label><label>Email or phone<input name="contact" autoComplete="email" placeholder="Let’s keep in touch" maxLength={150} required/></label></div><div className="form-row"><label>Check-in<input name="checkIn" aria-label="Check-in date" type="date" value={checkIn} onChange={event => { setCheckIn(event.target.value); if (checkOut && event.target.value >= checkOut) setCheckOut(''); }} required/></label><label>Check-out<input name="checkOut" aria-label="Check-out date" type="date" value={checkOut} min={checkIn ? new Date(new Date(`${checkIn}T12:00:00`).getTime() + 86400000).toLocaleDateString('en-CA') : undefined} onChange={event => setCheckOut(event.target.value)} required/></label></div><div className="form-row guests-row"><label>Number of guests<input name="guests" type="number" inputMode="numeric" min="1" max={site.propertyDetails.guestCapacity} step="1" placeholder="Your good company" required/></label><span>There’s a stay for your kind of together.<br/>We’ll help you plan the details.</span></div><label>A little about your plans <span className="optional">(optional)</span><textarea name="message" rows={2} maxLength={1500} placeholder="A celebration, a quiet weekend, or just because…"/></label><p className="form-error" role="alert" id="enquiry-error">{error}</p><button ref={submit} className="button button-ivory form-submit" type="submit" disabled={submitting} aria-describedby="enquiry-note enquiry-error">{submitting ? 'Checking your dates…' : 'Prepare my enquiry'} <Arrow diagonal/></button><p id="enquiry-note" className="form-note">We’ll chat on {channel} about availability and pricing. This is an enquiry, with no commitment to book. {availabilityMode === 'demo' && 'Sample dates are shown above; your host will confirm real availability.'} <a href={site.instagramMessage} target="_blank" rel="noopener noreferrer">Contact us directly <span aria-hidden="true">↗</span></a></p></form></Reveal>
    <dialog className="enquiry-dialog" ref={dialog} aria-labelledby="enquiry-dialog-heading" onCancel={close}><button className="dialog-close" onClick={close} aria-label="Close enquiry preview">×</button><p className="eyebrow">ONE STEP CLOSER</p><h2 id="enquiry-dialog-heading">Let’s make <em>plans.</em></h2><p>Copy your message below, then send it to us on {channel}. Your enquiry has not been sent yet.</p><label htmlFor="enquiry-preview" className="sr-only">Your enquiry message</label><textarea ref={preview} id="enquiry-preview" value={text} readOnly rows={9}/><div className="enquiry-dialog-actions"><button className="button button-green" onClick={copyMessage} disabled={copying}>{copying ? 'Copying…' : copied ? 'Message copied' : 'Copy enquiry'}<span aria-hidden="true">{copied ? '✓' : '↗'}</span></button><a className="text-link dark-link" href={destination} target="_blank" rel="noopener noreferrer">Continue on {channel} <Arrow diagonal/></a></div><p className="copy-status" role="status">{copied ? `Ready to paste into your ${channel} conversation.` : 'You can also select and copy the message yourself.'}</p></dialog>
  </section>;
}
