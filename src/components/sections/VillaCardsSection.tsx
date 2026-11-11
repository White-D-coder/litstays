import Image from 'next/image';
import { villas } from '@/lib/villas';
import villaImageLoader from '@/lib/villa-image-loader';
import { Arrow } from '../ui/Icons';
import styles from './VillaCardsSection.module.css';

// Homepage selections only: detail-page heroes and their foreground masks stay paired.
const homepageImages: Record<string, { src: string; alt: string }> = {
  'villa-archway': { src: '/lifestyle/archway-family.webp', alt: 'An Indian family arrives at the real Villa Archway at golden hour' },
  'villa-aurania': { src: '/lifestyle/aurania-family.webp', alt: 'An Indian family walks together beside Villa Aurania’s red-roofed veranda' },
  'villa-avante': { src: '/lifestyle/avante-family.webp', alt: 'An Indian family shares a moment at the entrance of Villa Avante' },
};

export function VillaCardsSection() {
  return <section id="villas" className={`${styles.section} section-padding`} aria-label="Our villas">
    <ul className={styles.villaCards} aria-label="Our villas">
      {villas.map(villa => <li key={villa.slug}>
        <a className={styles.villaCard} href={`/villas/${villa.slug}/`} aria-labelledby={`${villa.slug}-card-title`} aria-describedby={`${villa.slug}-card-facts`}>
          {villa.heroImage && <Image
            src={homepageImages[villa.slug]?.src || villa.heroImage.src}
            alt={homepageImages[villa.slug]?.alt || villa.heroImage.alt}
            fill
            sizes="(max-width: 760px) 80vw, (max-width: 1100px) 29vw, 30vw"
            loader={villaImageLoader}
            className={styles.villaCardImage}
          />}
          <div className={styles.villaCardShade} />
          <div className={styles.villaCardCopy}>
            <p className={styles.villaCardLocation}>{villa.location}</p>
            <h3 id={`${villa.slug}-card-title`}>{villa.name}</h3>
            <p className={styles.villaCardFacts} id={`${villa.slug}-card-facts`}>{villa.bedrooms} bedrooms <span aria-hidden="true">·</span> {villa.hasPool ? 'Private pool' : 'Private Jacuzzi'}</p>
            <span className={styles.villaCardLink}>Explore villa <Arrow diagonal /></span>
          </div>
        </a>
      </li>)}
    </ul>
  </section>;
}
