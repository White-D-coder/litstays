'use client';

import dynamic from 'next/dynamic';
import { Reveal } from '../ui/Reveal';
import { availabilityMode } from '@/lib/availability-client';

const AvailabilityCalendar = dynamic(() => import('../availability/AvailabilityCalendar'), { ssr: false, loading: () => <div className="calendar-loading" role="status">Preparing the calendar…</div> });

export function AvailabilitySection() {
  return <section className="availability-section section-padding" id="availability" aria-labelledby="availability-heading">
    <Reveal className="availability-intro"><p className="eyebrow">LEAVE A LITTLE ROOM IN YOUR CALENDAR</p><h2 id="availability-heading">A few days, <em>just for you.</em></h2><p>Find your dates, gather your people, and let the rest of the week wait.</p>{availabilityMode === 'demo' ? <p className="availability-demo-note"><span>PREVIEW CALENDAR</span>These are sample dates for exploring the website. Ask your host for actual availability.</p> : <p className="availability-small-print">Dates are checked against the property calendar. Availability is refreshed regularly and checked again before your enquiry.</p>}<p className="availability-small-print">Selecting dates starts an enquiry. It doesn’t reserve the bungalow.</p></Reveal>
    <div className="availability-calendar-wrap"><AvailabilityCalendar/></div>
  </section>;
}
