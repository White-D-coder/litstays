import type { SVGProps } from 'react';

export function Arrow({ diagonal = false, ...props }: SVGProps<SVGSVGElement> & { diagonal?: boolean }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true" {...props}>{diagonal ? <path d="M5 19 19 5M5 5h14v14" /> : <path d="M4 12h15m-6-6 6 6-6 6" />}</svg>;
}

export function BrandMark(props: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 54 58" fill="none" aria-hidden="true" {...props}><path d="M12 50V23a15 15 0 0 1 30 0v27M18 50V24a9 9 0 0 1 18 0v26M6 50h42M27 4V0M7 13 3 9m44 4 4-4" stroke="currentColor" strokeWidth="1"/><path d="M24 50V31h5v15h8v4z" fill="currentColor"/></svg>;
}

export function InstagramIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".7" fill="currentColor"/></svg>;
}
