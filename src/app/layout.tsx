import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { site } from '@/lib/site-content';
import './globals.css';

const serif = localFont({ src: [
  { path: '../../public/fonts/instrument-serif.woff2', style: 'normal', weight: '400' },
  { path: '../../public/fonts/instrument-serif-italic.woff2', style: 'italic', weight: '400' },
], variable: '--font-serif', display: 'swap', preload: true });
const sans = localFont({ src: '../../public/fonts/manrope.woff2', weight: '400 700', variable: '--font-sans', display: 'swap', preload: true });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: 'The Lit Stays — Some places stay with you.',
  description: 'Discover Villa Archway by The Lit Stays. A private villa in Virar East for unhurried mornings, good company and time that’s entirely your own.',
  openGraph: {
    title: 'The Lit Stays — Some places stay with you.',
    description: 'Private stays. Personal moments. Discover a little further from the everyday.',
    type: 'website', locale: 'en_IN', siteName: site.name,
    images: [{ url: '/images/aerial-1440.webp', width: 1440, height: 1074, alt: 'Villa Archway nestled in the green surroundings of Virar' }],
  },
  twitter: { card: 'summary_large_image' },
  icons: { icon: '/icon.svg', apple: '/apple-touch-icon.png' },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#0E1F0D', colorScheme: 'light' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${serif.variable} ${sans.variable}`}><body><a href="#main" className="skip-link">Skip to content</a>{children}</body></html>;
}
