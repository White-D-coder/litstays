'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { animate } from 'motion/mini';
import { inView } from 'motion';
import { foodBrochure, mealPackages, villaDining } from '@/lib/dining';
import villaImageLoader from '@/lib/villa-image-loader';
import { PdfBrochure } from './PdfBrochure';
import styles from './VillaDining.module.css';

export function VillaDining() {
  const section = useRef<HTMLElement>(null);
  const photograph = useRef<HTMLDivElement>(null);
  const packages = useRef<HTMLUListElement>(null);
  useEffect(() => {
    if (!section.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const stopPhoto = inView(section.current, () => {
      if (photograph.current) animate(photograph.current, { opacity: [.5, 1], transform: ['scale(1.04)', 'scale(1)'] }, { duration: 1.4, ease: [.22, 1, .36, 1] });
    }, { margin: '0px 0px -100px 0px' });
    const stopPrices = packages.current ? inView(packages.current, element => {
      Array.from(element.children).forEach((item, i) => animate(item, { opacity: [.2, 1] }, { duration: .7, delay: i * .1 }));
    }, { margin: '0px 0px -50px 0px' }) : undefined;
    return () => { stopPhoto(); stopPrices?.(); };
  }, []);

  return <section ref={section} id="villa-dining" className={styles.section} aria-labelledby="food-heading">
    <div className={styles.hero}>
      <div ref={photograph} className={styles.photograph}><Image src="/brochures/dining-1920.webp" alt="A generous spread of biryani, curries, fresh bread and accompaniments from The LIT Stays food brochure" fill loader={villaImageLoader} sizes="100vw" /></div>
      <div className={styles.shade} />
      <div className={`${styles.heroContent} section-padding`}>
        <div className={styles.heading}><h2 id="food-heading">Good food.<br/><em>Great company.</em></h2><ol className={styles.meals} aria-label="Included meals">{villaDining.meals.map(meal => <li key={meal}>{meal}</li>)}</ol></div>
        <PdfBrochure brochure={foodBrochure} dark minimal viewLabel="View menu" />
      </div>
    </div>
    <div className={`${styles.menu} section-padding`}>
      <ul ref={packages} className={styles.packages} aria-label="Food packages">{mealPackages.map(item => <li key={item.name}><span>{item.name}</span><strong><span className={styles.currency}>₹</span>{item.price.toLocaleString('en-IN')}</strong></li>)}</ul>
      <div className={styles.menuFoot}>
        <p className={styles.priceNote}>Per person, per day. Food is optional.<br/>Premium packages for 5 or more guests.</p>
        <details className={styles.terms}><summary>Dining details <span aria-hidden="true">+</span></summary><p>Finalise your menu at least 4 days before check-in and let us know of any allergies or dietary preferences. Full advance payment confirms your food package. Food is charged separately from your stay.</p></details>
      </div>
    </div>
  </section>;
}
