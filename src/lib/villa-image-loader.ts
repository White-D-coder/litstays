'use client';

import type { ImageLoaderProps } from 'next/image';

// Originals stay untouched. The preparation script supplies these four widths.
export default function villaImageLoader({ src, width }: ImageLoaderProps) {
  return src.replace(/-\d+\.webp$/, `-${width}.webp`);
}
