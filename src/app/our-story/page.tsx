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
  description: 'Get to know The LIT Stays, founder Hardik Panchal and the team behind our three private villas in Virar East.',
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
      <section id="about-us" className={`${styles.about} section-padding`} aria-label="About us">
        <div className={styles.sectionTop}>
          <p className={styles.label}><span>01</span> About us</p>
          <nav className={styles.pageNavigation} aria-label="On this page">
            <a href="#about-us">About us</a><a href="#owner">Owner</a><a href="#staff">Staff</a>
          </nav>
        </div>
        <div className={styles.introRow}>
          <h1 id="story-heading">Some places<br/><em>stay with you.</em></h1>
          <div className={styles.introCopy}><p>{ourStory.introduction}</p><a href="#owner" className={styles.textLink}>Meet the people behind it <Arrow /></a></div>
        </div>
        <Reveal className={styles.landscape}>
          <Image src="/archway/optimized/archway-aerial-1-1920.webp" alt="The LIT Stays villas nestled among green trees with hills beyond" fill loader={villaImageLoader} sizes="(max-width: 800px) 100vw, 90vw" loading="eager" fetchPriority="high" />
          <div className={styles.landscapeShade} />
          <div className={styles.landscapeCaption}><p>A little closer<br/><em>to nature.</em></p><span>VIRAR EAST, MAHARASHTRA</span></div>
        </Reveal>
        <div className={styles.company}>
          <div><p className={styles.eyebrow}>PRIVATE STAYS. PERSONAL MOMENTS.</p><h2>Together is<br/><em>a good place to be.</em></h2></div>
          <div className={styles.companyCopy}>{ourStory.company.map(paragraph => <p key={paragraph}>{paragraph}</p>)}<p className={styles.companyFootnote}>Three villas. One place to come together.</p></div>
        </div>
      </section>

      <section id="owner" className={`${styles.owner} section-padding`} aria-label="Owner">
        <p className={styles.label}><span>02</span> Owner</p>
        <div className={styles.ownerGrid}>
          <Reveal className={styles.ownerVisual}>
            <div className={styles.ownerMonogram} role="img" aria-label={`Brand monogram for ${ourStory.founder.name}`}>
              <BrandMark className={styles.ownerMark} aria-hidden="true" />
              <span className={styles.initials} aria-hidden="true">{ourStory.founder.initials}</span>
              <span className={styles.monogramCaption} aria-hidden="true">THE PERSON BEHIND THE STAYS</span>
            </div>
            <div className={styles.ownerVisualCaption}><span>THE LIT STAYS</span><span>Made for time together.</span></div>
          </Reveal>
          <div className={styles.ownerCopy}>
            <p className={styles.eyebrow}>A PERSONAL BEGINNING</p>
            <h2>{ourStory.founder.name}</h2>
            <p className={styles.ownerRole}>{ourStory.founder.role} <span aria-hidden="true">·</span> The LIT Stays</p>
            <p className={styles.ownerDescription}>{ourStory.founder.description}</p>
            <p className={styles.ownerNote}>A private place.<br/><em>A personal welcome.</em></p>
            <a href={site.instagramMessage} target="_blank" rel="noopener noreferrer" className={styles.textLink}>Say hello <Arrow diagonal /></a>
          </div>
        </div>
      </section>

      <section id="staff" className={`${styles.staff} section-padding`} aria-label="Staff">
        <p className={styles.label}><span>03</span> Staff</p>
        <div className={styles.staffHeading}>
          <h2>Good stays begin<br/><em>with good people.</em></h2>
          <p>{ourStory.staff.introduction}</p>
        </div>
        <div className={styles.staffGrid}>
          <Reveal className={styles.staffPhoto}>
            <Image src="/archway/optimized/archway-3-1920.webp" alt="Cushions, fresh drinks and little comforts arranged for guests at Villa Archway" fill loader={villaImageLoader} sizes="(max-width: 800px) 100vw, 48vw" />
            <div className={styles.staffPhotoCaption}><BrandMark aria-hidden="true" /><span>Care in the<br/><em>little things.</em></span></div>
          </Reveal>
          <div className={styles.teamCopy}>
            <p className={styles.eyebrow}>THE TEAM BEHIND YOUR STAY</p>
            <ul className={styles.teamValues}>{ourStory.staff.values.map((value, index) => <li key={value.title}>
              <span className={styles.valueNumber} aria-hidden="true">0{index + 1}</span>
              <div><h3>{value.title}</h3><p>{value.description}</p></div>
            </li>)}</ul>
          </div>
        </div>
        <div className={styles.collection}>
          <h3 id="collection-heading">Find your <em>kind of stay.</em></h3>
          <nav aria-labelledby="collection-heading">{villas.map(villa => <a href={`/villas/${villa.slug}/`} key={villa.slug}>{villa.name}<Arrow diagonal /></a>)}</nav>
        </div>
      </section>
      <Footer homePath="/" datesHref={site.instagramMessage} datesLabel="Contact" />
    </main>
  </>;
}
