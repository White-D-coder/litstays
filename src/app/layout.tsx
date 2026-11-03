import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { site } from '@/lib/site-content';
import './globals.css';
import './intro-artwork.css';
import './intro-slideshow.css';
import './villa-spaces.css';
import './gallery-journal.css';
import './site-refinements.css';
import './editorial-update.css';
import './room-for-you.css';
import './gallery-masonry.css';
import './section-watermarks.css';
import './hero.css';
import { HeadingSelection } from '@/components/ui/HeadingSelection';

const serif = localFont({ src: '../../public/fonts/cormorant-garamond.woff2', style: 'normal', weight: '300 700', variable: '--font-serif', display: 'swap', preload: true });
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
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#2C3B28', colorScheme: 'light' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${serif.variable} ${sans.variable}`}><body><HeadingSelection/><a href="#main" className="skip-link">Skip to content</a>{children}</body></html>;
}
