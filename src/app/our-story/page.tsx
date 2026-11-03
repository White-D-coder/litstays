import type { Metadata } from 'next';
import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Arrow, BrandMark } from '@/components/ui/Icons';
import { Reveal } from '@/components/ui/Reveal';
import { ourStory } from '@/lib/our-story';
import { site } from '@/lib/site-content';
import { villas } from '@/lib/villas';
import villaImageLoader from '@/lib/villa-image-loader';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Our Story | The LIT Stays',
  description: 'Meet The LIT Stays and founder Hardik Panchal. Three private villas in Virar East, made for time together.',
  alternates: { canonical: '/our-story/' },
  openGraph: {
    title: 'Our Story | The LIT Stays',
    description: ourStory.introduction,
    url: '/our-story/',
    images: [{ url: '/archway/optimized/archway-aerial-1-1920.webp', alt: 'The villas surrounded by trees and hills in Virar East' }],
  },
};

export default function OurStoryPage() {
  return <>
    <Navbar homePath="/" currentPath="/our-story/" light enquiryHref={site.instagramMessage} />
    <main id="main" className={styles.page}>
      <section className={`${styles.intro} section-padding`} aria-labelledby="story-heading">
        <p className={styles.label}>Our story</p>
        <div className={styles.introRow}><h1 id="story-heading">Some places<br/><em>stay with you.</em></h1><p>{ourStory.introduction}</p></div>
        <Reveal className={styles.landscape}><Image src="/archway/optimized/archway-aerial-1-1920.webp" alt="The LIT Stays villas nestled among green trees with hills beyond" fill loader={villaImageLoader} sizes="100vw" loading="eager" fetchPriority="high" /></Reveal>
      </section>

      <section className={`${styles.company} section-padding`} aria-labelledby="company-heading">
        <h2 id="company-heading">Together is<br/><em>a good place to be.</em></h2>
        <div>{ourStory.company.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
      </section>

      <section className={`${styles.founder} section-padding`} aria-labelledby="founder-heading">
        <div className={styles.founderEmblem} aria-hidden="true"><BrandMark /><span>{ourStory.founder.initials}</span></div>
        <div className={styles.founderCopy}><p className={styles.label}>The person behind the stays</p><h2 id="founder-heading">{ourStory.founder.name}</h2><p>{ourStory.founder.role} · The LIT Stays</p><div className={styles.founderRule} /><p className={styles.founderNote}>Private stays.<br/><em>Personal moments.</em></p></div>
      </section>

      <section className={`${styles.collection} section-padding`} aria-labelledby="collection-heading">
        <h2 id="collection-heading">Find your <em>kind of stay.</em></h2>
        <div className={styles.villas}>{villas.map(villa => <a href={`/villas/${villa.slug}/`} key={villa.slug}>
          {villa.heroImage && <span className={styles.villaPhoto}><Image src={villa.heroImage.src} alt={villa.heroImage.alt} fill loader={villaImageLoader} unoptimized={!villa.heroImage.responsive} sizes="(max-width: 800px) 100vw, 33vw" /></span>}
          <span className={styles.villaName}>{villa.name}<Arrow diagonal /></span><span className={styles.villaType}>{villa.bedrooms} bedrooms · {villa.hasPool ? 'Private pool' : 'Private Jacuzzi'}</span>
        </a>)}</div>
      </section>
      <Footer homePath="/" datesHref={site.instagramMessage} datesLabel="Contact" />
    </main>
  </>;
}
