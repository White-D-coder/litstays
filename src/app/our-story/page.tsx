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
          <p className={styles.sectionLabel}><span>01</span> About us</p>
          <nav className={styles.pageNavigation} aria-label="On this page">
            <a href="#about-us">About us</a><a href="#owner">Owner</a><a href="#staff">Staff</a>
          </nav>
        </div>
        <div className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>OUR STORY, YOUR LITTLE ESCAPE</p>
            <h1>A place for<br/> <em>your people.</em></h1>
            <p className={styles.introduction}>{ourStory.introduction}</p>
            <a href="#owner" className={styles.button}>Meet the people <Arrow diagonal /></a>
            <div className={styles.brandNote}><BrandMark aria-hidden="true" /><p>Private stays.<br/><em>Personal moments.</em></p></div>
          </div>
          <Reveal className={styles.heroVisual}>
            <div className={styles.heroMainPhoto}>
              <Image src="/archway/optimized/archway-45-1920.webp" alt="A welcoming passage between the villas, lined with palms and warm arched windows" fill loader={villaImageLoader} sizes="(max-width: 760px) 85vw, 45vw" loading="eager" fetchPriority="high" />
              <span>VIRAR EAST, MAHARASHTRA</span>
            </div>
            <figure className={styles.heroInset}>
              <div><Image src="/archway/optimized/archway-29-1920.webp" alt="Villa Archway’s private swimming pool and sunny courtyard" fill loader={villaImageLoader} sizes="(max-width: 760px) 42vw, 23vw" loading="eager" /></div>
              <figcaption>A slower kind of afternoon.</figcaption>
            </figure>
          </Reveal>
        </div>
        <div className={styles.aboutStory}>
          <h2>Three villas.<br/><em>One feeling.</em></h2>
          <div>{ourStory.company.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
        </div>
      </section>

      <section id="owner" className={`${styles.owner} section-padding`} aria-label="Owner">
        <p className={styles.sectionLabel}><span>02</span> Owner</p>
        <div className={styles.ownerGrid}>
          <div className={styles.ownerCopy}>
            <div className={styles.ownerIdentity}><span role="img" aria-label={`Brand monogram for ${ourStory.founder.name}`}>{ourStory.founder.initials}</span><p className={styles.eyebrow}>THE PERSON<br/>BEHIND THE PLACE</p></div>
            <h2>{ourStory.founder.name}</h2>
            <p className={styles.ownerRole}>{ourStory.founder.role} <span aria-hidden="true">·</span> The LIT Stays</p>
            <p className={styles.ownerDescription}>{ourStory.founder.description}</p>
            <p className={styles.ownerNote}>A little room to slow down.<br/><em>A little more time together.</em></p>
            <a href={site.instagramMessage} target="_blank" rel="noopener noreferrer" className={styles.textLink}>Say hello to The LIT Stays <Arrow diagonal /></a>
          </div>
          <Reveal className={styles.ownerVisual}>
            <div className={styles.ownerPhoto}><Image src="/archway/optimized/archway-54-1920.webp" alt="Villa Archway’s sunlit arched facade and balconies framed by a tall palm" fill loader={villaImageLoader} sizes="(max-width: 760px) 100vw, 40vw" /></div>
            <p>A place to bring <em>your people together.</em></p>
          </Reveal>
        </div>
      </section>

      <section id="staff" className={`${styles.staff} section-padding`} aria-label="Staff">
        <div className={styles.staffTop}><p className={styles.sectionLabel}><span>03</span> Staff</p><span className={styles.eyebrow}>THE CARE BEHIND YOUR STAY</span></div>
        <div className={styles.staffHeading}>
          <h2>Good people.<br/><em>Thoughtful stays.</em></h2>
          <p>{ourStory.staff.introduction}</p>
        </div>
        <ul className={styles.teamCards}>{ourStory.staff.values.map((value, index) => <li key={value.title}>
          <Reveal className={styles.teamPhoto}><Image src={value.photo.src} alt={value.photo.alt} fill loader={villaImageLoader} sizes="(max-width: 600px) 100vw, (max-width: 900px) 46vw, 30vw" /></Reveal>
          <div className={styles.teamCardCopy}><span className={styles.valueNumber} aria-hidden="true">0{index + 1}</span><div><h3>{value.title}</h3><p>{value.description}</p></div></div>
        </li>)}</ul>
        <div className={styles.collection}>
          <div><p className={styles.eyebrow}>COME MAKE YOURSELF AT HOME</p><h3 id="collection-heading">Find your <em>kind of stay.</em></h3></div>
          <nav aria-labelledby="collection-heading">{villas.map(villa => <a href={`/villas/${villa.slug}/`} key={villa.slug}>{villa.name}<Arrow diagonal /></a>)}</nav>
        </div>
      </section>
      <Footer homePath="/" datesHref={site.instagramMessage} datesLabel="Contact" />
    </main>
  </>;
}
