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

export function PropertyIcon({ kind, ...props }: SVGProps<SVGSVGElement> & { kind: 'villa' | 'bed' | 'bath' | 'pool' | 'guests' | 'wifi' }) {
  const paths = {
    villa: <><path d="m4 16 20-12 20 12M8 14v29h32V14M4 44h40M19 43V28h10v15M15 18h5v5h-5zm13 0h5v5h-5z"/><path d="M38 9V4h-6v2"/></>,
    bed: <><path d="M5 39V12m38 27V23H5m0 11h38M9 23v-7h10v7m4 0v-7h15v7M5 34v7m38-7v7"/></>,
    bath: <><path d="M5 23h38l-3 14H9L6 26M12 37v6m24-6v6M11 23V10a6 6 0 0 1 12 0v3M19 13h8M31 15v3m6-5v3"/></>,
    pool: <><path d="M4 33q5-5 10 0t10 0 10 0 10 0M4 42q5-5 10 0t10 0 10 0 10 0M13 29V9a5 5 0 0 1 10 0m6 20V9a5 5 0 0 1 10 0M13 14h16m-16 8h16"/></>,
    wifi: <><path d="M5 17a29 29 0 0 1 38 0M11 24a20 20 0 0 1 26 0M18 31a10 10 0 0 1 12 0"/><circle cx="24" cy="39" r="2" fill="currentColor" stroke="none"/></>,
    guests: <><circle cx="24" cy="14" r="6"/><path d="M13 40v-6a11 11 0 0 1 22 0v6M8 13a5 5 0 1 0 0 10m32-10a5 5 0 1 1 0 10M3 39v-6a8 8 0 0 1 7-8m35 14v-6a8 8 0 0 0-7-8"/></>,
  };
  return <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[kind]}</svg>;
}
