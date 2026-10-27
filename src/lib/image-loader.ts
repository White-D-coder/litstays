'use client';

import type { ImageLoaderProps } from 'next/image';

// These responsive WebP files are generated ahead of time; no image server is needed.
export default function imageLoader({ src, width }: ImageLoaderProps) {
  return `/images/${src.replace(/^\//, '').replace(/\.[^.]+$/, '')}-${width}.webp`;
}
