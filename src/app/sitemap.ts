import type { MetadataRoute } from 'next';
import { site } from '@/lib/site-content';
import { villas } from '@/lib/villas';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, changeFrequency: 'monthly', priority: 1 },
    { url: `${site.url}/our-story/`, changeFrequency: 'monthly', priority: .7 },
    ...villas.map(villa => ({ url: `${site.url}/villas/${villa.slug}/`, changeFrequency: 'monthly' as const, priority: .8 })),
  ];
}
