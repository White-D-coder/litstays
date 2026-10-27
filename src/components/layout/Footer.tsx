import { navigation, site } from '@/lib/site-content';
import { Arrow, BrandMark, InstagramIcon } from '../ui/Icons';

export function Footer() {
  return <footer className="footer section-padding"><div className="footer-main"><a href="#home" className="wordmark footer-wordmark"><BrandMark/><span>the lit stays<span className="wordmark-sub" aria-hidden="true">SOME PLACES STAY WITH YOU.</span></span></a><nav aria-label="Footer navigation">{navigation.map(item => <a key={item.href} href={item.href}>{item.label}</a>)}<a href="#location">Find us</a></nav><a className="footer-social" href={site.instagram} target="_blank" rel="noopener noreferrer"><InstagramIcon/><span>A little of life here<br/><strong>@the_lit_stays</strong></span><Arrow diagonal/></a></div><div className="footer-bottom"><p>© {new Date().getFullYear()} The Lit Stays. All rights reserved.</p><span>{site.location}, India</span><a href="#home">Back to the slow life <span aria-hidden="true">↑</span></a></div></footer>;
}
