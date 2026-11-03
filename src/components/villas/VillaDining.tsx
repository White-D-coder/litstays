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
    return inView(section.current, () => {
      if (photograph.current) animate(photograph.current, { clipPath: ['inset(5% 5% 5% 5%)', 'inset(0% 0% 0% 0%)'], transform: ['scale(1.04)', 'scale(1)'] }, { duration: 1.25, ease: [.22, 1, .36, 1] });
      Array.from(packages.current?.children || []).forEach((item, i) => animate(item, { opacity: [.2, 1] }, { duration: .7, delay: .18 + i * .12 }));
    }, { margin: '0px 0px -100px 0px' });
  }, []);

  return <section ref={section} id="villa-dining" className={`${styles.section} section-padding`} aria-labelledby="food-heading">
    <div className={styles.visual}><div ref={photograph} className={styles.photograph}><Image src="/brochures/dining-1920.webp" alt="Biryani, curries, fresh bread and accompaniments from The LIT Stays food brochure" fill loader={villaImageLoader} sizes="(max-width: 800px) 100vw, 50vw" /></div></div>
    <div className={styles.content}>
      <h2 id="food-heading">Good food.<br/><em>Great company.</em></h2>
      <ol className={styles.meals} aria-label="Included meals">{villaDining.meals.map(meal => <li key={meal}>{meal}</li>)}</ol>
      <ul ref={packages} className={styles.packages} aria-label="Food packages">{mealPackages.map(item => <li key={item.name}><span>{item.name}</span><strong><span className={styles.currency}>₹</span>{item.price.toLocaleString('en-IN')}</strong></li>)}</ul>
      <p className={styles.priceNote}>Per person, per day. Food is optional.<br/>Premium packages for 5 or more guests.</p>
      <PdfBrochure brochure={foodBrochure} dark minimal viewLabel="View food menu" />
      <details className={styles.terms}><summary>Dining details <span aria-hidden="true">+</span></summary><p>Finalise your menu at least 4 days before check-in and let us know of any allergies or dietary preferences. Full advance payment confirms your food package. Food is charged separately from your stay.</p></details>
    </div>
  </section>;
}
