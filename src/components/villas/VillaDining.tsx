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
  const photographs = useRef<HTMLDivElement>(null);
  const packages = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!photographs.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const animations: ReturnType<typeof animate>[] = [];
    const stopPhotos = inView(photographs.current.querySelectorAll('[data-dining-photo]'), element => {
      animations.push(animate(element, {
        opacity: [.4, 1],
        transform: ['translateY(20px) scale(1.035)', 'translateY(0) scale(1)'],
      }, { duration: 1.3, ease: [.22, 1, .36, 1] }));
    }, { margin: '0px 0px -60px 0px' });
    const stopPrices = packages.current ? inView(packages.current, element => {
      Array.from(element.children).forEach((item, i) => {
        animations.push(animate(item, { opacity: [.2, 1] }, { duration: .7, delay: i * .1 }));
      });
    }, { margin: '0px 0px -50px 0px' }) : undefined;
    return () => {
      stopPhotos();
      stopPrices?.();
      animations.forEach(animation => animation.stop());
    };
  }, []);

  return <section id="villa-dining" className={`${styles.section} section-padding`} aria-labelledby="food-heading">
    <div className={styles.heading}>
      <h2 id="food-heading"><span>Good food.</span>{' '}<em>Great company.</em></h2>
      <ol className={styles.meals} aria-label="Included meals">
        {villaDining.meals.map(meal => <li key={meal}>{meal}</li>)}
      </ol>
    </div>
    <div className={styles.layout}>
      <div ref={photographs} className={styles.photographs}>
        <div className={styles.foodPhoto}>
          <div data-dining-photo className={styles.image}>
            <Image
              src="/brochures/dining-1920.webp"
              alt="Biryani, curries and fresh bread from The LIT Stays food menu"
              fill
              loader={villaImageLoader}
              sizes="(max-width: 700px) 80vw, (max-width: 1000px) 67vw, 42vw"
            />
          </div>
        </div>
        <div className={styles.tablePhoto}>
          <div data-dining-photo className={styles.image}>
            <Image
              src="/brochures/dining-table-1920.webp"
              alt="A table set for a shared meal beside the villa's sunlit arched window"
              fill
              loader={villaImageLoader}
              sizes="(max-width: 1000px) 37vw, 20vw"
            />
          </div>
        </div>
      </div>
      <div className={styles.content}>
        <ul ref={packages} className={styles.packages} aria-label="Food packages">
          {mealPackages.map(item => <li key={item.name}>
            <span>{item.name}</span>
            <strong><span className={styles.currency}>₹</span>{item.price.toLocaleString('en-IN')}</strong>
          </li>)}
        </ul>
        <p className={styles.priceNote}>Per person, per day. Food is optional.</p>
        <div className={styles.brochure}>
          <PdfBrochure brochure={foodBrochure} minimal viewLabel="View full menu" />
        </div>
        <section className={styles.foodRules} aria-labelledby="food-rules-heading">
          <h3 id="food-rules-heading">Food Rules</h3>
          <ul>
            <li>Premium package requires 5+ guests.</li>
            <li>Menu must be finalised 4 days in advance.</li>
            <li>Full advance payment confirms the food package.</li>
            <li>Food is charged separately.</li>
          </ul>
        </section>
        <details className={styles.terms}>
          <summary>Dining details <span aria-hidden="true">+</span></summary>
          <p>Premium packages for 5 or more guests. Finalise your menu at least 4 days before check-in and let us know of any allergies or dietary preferences. Full advance payment confirms your food package. Food is charged separately from your stay.</p>
        </details>
      </div>
    </div>
  </section>;
}
