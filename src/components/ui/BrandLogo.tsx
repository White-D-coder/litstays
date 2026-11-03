import Image from 'next/image';
import styles from './BrandLogo.module.css';

type Tone = 'adaptive' | 'ink' | 'light' | 'sand' | 'forest';

/** The enclosing home link supplies the accessible name. */
export function BrandLogo({ tone = 'adaptive' }: { tone?: Tone }) {
  return <span className={styles.logo} data-tone={tone} aria-hidden="true">
    {tone === 'adaptive' ? <>
      <Image className={styles.light} src="/brand/logo-light.png" alt="" width={652} height={374} unoptimized loading="eager" />
      <Image className={styles.ink} src="/brand/logo-ink.png" alt="" width={652} height={374} unoptimized loading="eager" />
    </> : <Image src={`/brand/logo-${tone}.png`} alt="" width={652} height={374} unoptimized />}
  </span>;
}
