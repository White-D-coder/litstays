'use client';

import { getImageProps } from 'next/image';
import { useRef } from 'react';
import { LazyMotion, domAnimation, m, useReducedMotion, useScroll, useTransform } from 'motion/react';
import villaImageLoader from '@/lib/villa-image-loader';
import { useStay } from '../availability/StayProvider';
import { addDays, dateInZone } from '@/lib/availability-rules';
import { site } from '@/lib/site-content';
import { VillaHeroSlideshow as HeroSlideshow, type HeroSlide } from '../villas/VillaHeroSlideshow';

const slides: HeroSlide[] = [
  { id: 'home-archway', src: '/lifestyle/archway-family.webp', alt: 'A family arriving at Villa Archway beneath its palm trees', responsive: true },
  { id: 'home-avante', src: '/lifestyle/avante-family.webp', alt: 'A family sharing a moment outside Villa Avante', responsive: true },
  { id: 'home-aurania', src: '/lifestyle/aurania-family.webp', alt: 'A family walking beside Villa Aurania’s veranda', responsive: true },
];

export function HeroSection() {
  const { dates, setDates, guests, setGuests } = useStay();
  const today = dateInZone(Date.now(), 'Asia/Kolkata');
  const preload = getImageProps({ src: slides[0].src, width: 1536, height: 1024, alt: '', sizes: '100vw', loader: villaImageLoader }).props;
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0, .55], [1, 0]);
  const y = useTransform(scrollYProgress, [0, .7], [0, -65]);
  return <section id="home" className="hero" ref={ref} aria-labelledby="hero-heading">
    <link rel="preload" as="image" imageSrcSet={preload.srcSet} imageSizes="100vw" fetchPriority="high"/>
    <div id="nav-sentinel"/>
    <div className="hero-sticky">
      <HeroSlideshow name="LIT Stays" slides={slides} variant="home" />
      <div className="hero-shade"/>
      <LazyMotion features={domAnimation}><m.div className="hero-content" style={reduced ? undefined : { opacity, y }}>
        <p className="eyebrow hero-enter">PRIVATE STAYS. PERSONAL MOMENTS.</p>
        <h1 id="hero-heading">Some places stay <em>with you.</em></h1>
        <p className="hero-description hero-enter">A place to slow down. Room to reconnect. A little time that’s entirely your own.</p>
        <div className="hero-booking hero-enter" role="group" aria-label="Your stay">
          <label>Guests <span className="hero-required" aria-hidden="true">*</span>
            <select name="heroGuests" value={guests} onChange={event => setGuests(event.target.value)} required>
              <option value="" disabled>Select guests</option>
              {Array.from({ length: site.propertyDetails.guestCapacity }, (_, index) => index + 1).map(count => <option key={count} value={count}>{count} {count === 1 ? 'guest' : 'guests'}</option>)}
            </select>
          </label>
          <label>Villas <span className="hero-required" aria-hidden="true">*</span>
            <select name="heroVilla" defaultValue={site.property} required><option value={site.property}>{site.property}</option></select>
          </label>
          <label>Check-In Date <span className="hero-required" aria-hidden="true">*</span>
            <span className="hero-date" data-empty={!dates.checkIn}>
              <span className="hero-date-placeholder" aria-hidden="true">Check In</span>
              <input name="heroCheckIn" type="date" value={dates.checkIn} min={today} onChange={event => setDates(current => ({ checkIn: event.target.value, checkOut: current.checkOut > event.target.value ? current.checkOut : '' }))} required/>
            </span>
          </label>
          <label>Check-Out Date <span className="hero-required" aria-hidden="true">*</span>
            <span className="hero-date" data-empty={!dates.checkOut}>
              <span className="hero-date-placeholder" aria-hidden="true">Check Out</span>
              <input name="heroCheckOut" type="date" value={dates.checkOut} min={dates.checkIn ? addDays(dates.checkIn, 1) : addDays(today, 1)} onChange={event => setDates(current => ({ ...current, checkOut: event.target.value }))} required/>
            </span>
          </label>
        </div>
      </m.div></LazyMotion>
      <div className="hero-bottom hero-enter"><a href="#introduction" className="scroll-cue"><span className="scroll-line"/>SCROLL TO SLOW DOWN</a><span className="hero-footnote">Thoughtfully stayed.<br/><span>Beautifully remembered.</span></span></div>
      <span className="hero-vertical" aria-hidden="true">THE ART OF DOING A LITTLE LESS</span>
    </div>
  </section>;
}
