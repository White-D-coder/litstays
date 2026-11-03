import Image from 'next/image';
import type { CSSProperties } from 'react';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';
import { Arrow, BrandMark } from '../ui/Icons';
import { Reveal } from '../ui/Reveal';
import { formatRupees, type Villa } from '@/lib/villas';
import { site } from '@/lib/site-content';
import { VillaGallery } from './VillaGallery';
import { VillaDining } from './VillaDining';
import { PdfBrochure } from './PdfBrochure';
import villaImageLoader from '@/lib/villa-image-loader';
import styles from './VillaDetail.module.css';

export function VillaDetail({ villa }: { villa: Villa }) {
  const photoStyle = {
    '--hero-position': villa.heroImage?.position || 'center',
    '--hero-mobile-position': villa.heroImage?.mobilePosition || 'center',
    '--hero-mask': villa.heroImage?.foregroundMask ? `url("${villa.heroImage.foregroundMask}")` : 'none',
    '--hero-sky': villa.heroImage?.sky || 'var(--forest)',
  } as CSSProperties;
  const comfortPhoto = villa.photos?.[2];

  return <>
    <Navbar homePath="/" currentPath={`/villas/${villa.slug}/`} enquiryHref={site.instagramMessage} />
    <main id="main" className={styles.page}>
      <div id="nav-sentinel" className={styles.navSentinel} aria-hidden="true" />
      <section className={styles.hero} id="home" aria-labelledby="villa-heading" style={photoStyle}>
        <div className={styles.heroMedia}>
          {villa.heroImage
            ? <Image src={villa.heroImage.src} alt={villa.heroImage.alt} fill sizes="(max-aspect-ratio: 3/2) 150svh, 100vw" loader={villaImageLoader} unoptimized={!villa.heroImage.responsive} loading="eager" fetchPriority="high" />
            : <BrandMark className={styles.heroFallback} />}
        </div>
        <div className={styles.heroTopShade} />
        <div className={styles.heroTitle}>
          <p aria-hidden="true">THE LIT STAYS · VILLA</p>
          <h1 id="villa-heading"><span className={styles.srOnly}>Villa </span>{villa.name.replace(/^Villa /, '')}</h1>
        </div>
        {villa.heroImage?.foregroundMask && <div className={`${styles.heroMedia} ${styles.heroForeground}`} aria-hidden="true">
          <Image src={villa.heroImage.src} alt="" fill sizes="(max-aspect-ratio: 3/2) 150svh, 100vw" loader={villaImageLoader} unoptimized={!villa.heroImage.responsive} loading="eager" />
        </div>}
        <div className={styles.heroShade} />
        <div className={`${styles.heroInner} section-padding`}>
          <div className={styles.stayBar} aria-label={`${villa.name} at a glance`}>
            <p className={styles.heroFacts}><span>{villa.location}</span><span>{villa.bedrooms} bedrooms</span><span>{villa.hasPool ? 'Private swimming pool' : 'Jacuzzi · without pool'}</span></p>
            <a href={site.instagramMessage} target="_blank" rel="noopener noreferrer">Plan your stay <Arrow diagonal /></a>
          </div>
          <a className={styles.discover} href="#villa-details">Discover <span aria-hidden="true">↓</span></a>
        </div>
      </section>

      <div className={styles.content} id="villa-content">
        <section className={`${styles.overview} section-padding`} id="villa-details" aria-labelledby="overview-heading">
          <div className={styles.overviewTop}>
            <div className={styles.overviewIntro}><h2 id="overview-heading">{villa.introduction}</h2><p>{villa.description}</p></div>
            <aside className={styles.quote} aria-label={`${villa.name} stay quotation`}>
              <div>{villa.stayPrice !== undefined ? <><p className={styles.price}><span className={styles.currency}>₹</span>{villa.stayPrice.toLocaleString('en-IN')}</p><p className={styles.priceLabel}>Your villa stay</p></> : <p className={styles.priceRequest}>Price on request</p>}</div>
              <div>{villa.refundableDeposit !== undefined ? <p className={styles.deposit}>{formatRupees(villa.refundableDeposit)} extra deposit<br/><span>Refundable on checkout.</span></p> : <p className={styles.deposit}>Share your dates for a quotation.</p>}</div>
              {villa.priceIncludes && <p className={styles.quoteNote}>Stay & amenities included. Food extra.</p>}
            </aside>
          </div>
          <div className={styles.overviewFoot}>
            <p>{villa.bedrooms} bedrooms <span aria-hidden="true">/</span> {villa.hasPool ? 'Private pool' : 'Private Jacuzzi · no pool'} <span aria-hidden="true">/</span> {villa.location}</p>
            <PdfBrochure brochure={{ ...villa.brochure, title: `${villa.name} brochure` }} minimal viewLabel="View villa brochure" />
          </div>
        </section>

        {villa.photos?.length ? <VillaGallery name={villa.name} photos={villa.photos} /> : null}

        <section className={`${styles.comforts} section-padding`} id="villa-comforts" aria-labelledby="amenities-heading">
          {comfortPhoto && <Reveal className={styles.comfortVisual}><Image src={comfortPhoto.src} alt={comfortPhoto.alt} fill loader={villaImageLoader} unoptimized={!comfortPhoto.responsive} sizes="(max-width: 800px) 100vw, 48vw" /></Reveal>}
          <div className={styles.comfortContent}>
            <h2 id="amenities-heading">The comforts.</h2>
            <ul className={styles.amenityList}>{villa.amenities.map(amenity => <li key={amenity.name}><details name="villa-amenities"><summary>{amenity.name}<span aria-hidden="true">+</span></summary><p>{amenity.detail}</p></details></li>)}</ul>
          </div>
        </section>

        <VillaDining />
        <Footer homePath="/" datesHref={site.instagramMessage} datesLabel="Contact" />
      </div>
    </main>
  </>;
}
