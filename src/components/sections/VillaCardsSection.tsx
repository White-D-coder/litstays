import Image from 'next/image';
import { villas } from '@/lib/villas';
import villaImageLoader from '@/lib/villa-image-loader';
import { Arrow } from '../ui/Icons';
import styles from './VillaCardsSection.module.css';

export function VillaCardsSection() {
  return <section id="villas" className={`${styles.section} section-padding`} aria-label="Our villas">
    <ul className={styles.villaCards} aria-label="Our villas">
      {villas.map(villa => <li key={villa.slug}>
        <a className={styles.villaCard} href={`/villas/${villa.slug}/`} aria-labelledby={`${villa.slug}-card-title`} aria-describedby={`${villa.slug}-card-facts`}>
          {villa.heroImage && <Image
            src={villa.heroImage.src}
            alt={villa.heroImage.alt}
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
