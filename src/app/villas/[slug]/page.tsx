import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { VillaDetail } from '@/components/villas/VillaDetail';
import { getVilla, villas } from '@/lib/villas';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return villas.map(villa => ({ slug: villa.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const villa = getVilla((await params).slug);
  if (!villa) notFound();
  const title = `${villa.name} — ${villa.bedrooms}BHK ${villa.style} | The LIT Stays`;
  return {
    title,
    description: `${villa.name} in ${villa.location}. ${villa.description}`,
    alternates: { canonical: `/villas/${villa.slug}/` },
    openGraph: {
      title,
      description: villa.description,
      url: `/villas/${villa.slug}/`,
      type: 'website',
      images: villa.heroImage ? [{ url: villa.heroImage.src, alt: villa.heroImage.alt }] : [],
    },
  };
}

export default async function VillaPage({ params }: Props) {
  const villa = getVilla((await params).slug);
  if (!villa) notFound();
  return <VillaDetail villa={villa} />;
}
