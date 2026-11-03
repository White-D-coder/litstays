import { navigation, site } from '@/lib/site-content';
import { Arrow, InstagramIcon } from '../ui/Icons';
import { BrandLogo } from '../ui/BrandLogo';
import styles from './Navigation.module.css';

export function Footer({ homePath = '', datesHref = '#availability', datesLabel = 'Your dates' }: { homePath?: string; datesHref?: string; datesLabel?: string }) {
  const href = (value: string) => value.startsWith('#') ? `${homePath}${value}` : value;
  return <footer className={`footer section-padding ${styles.footer}`}><div className="footer-main"><a href={href('#home')} className="wordmark footer-wordmark" aria-label="The Lit Stays home"><BrandLogo tone="sand" /></a><nav aria-label="Footer navigation">{navigation.map(item => <a key={item.href} href={href(item.href)}>{item.label}</a>)}<a href={datesHref}>{datesLabel}</a></nav><a className="footer-social" href={site.instagram} target="_blank" rel="noopener noreferrer"><InstagramIcon/><span>A little of life here<br/><strong>@the_lit_stays</strong></span><Arrow diagonal/></a></div><div className="footer-bottom"><p>© {new Date().getFullYear()} The Lit Stays. All rights reserved.</p><span>{site.location}, India</span><a href={href('#home')}>Back to the slow life <span aria-hidden="true">↑</span></a></div></footer>;
}
