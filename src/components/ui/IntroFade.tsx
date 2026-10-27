'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { animate } from 'motion/mini';
import { inView } from 'motion';

type IntroFadeProps = {
  as?: 'div' | 'h2' | 'p';
  id?: string;
  className?: string;
  children: ReactNode;
  delay?: number;
  duration?: number;
};

// Animates the existing text element, keeping its original layout and line breaks.
export function IntroFade({ as = 'div', id, className, children, delay = 0, duration = .95 }: IntroFadeProps) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const element = ref.current;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!element || media.matches) return;
    let playback: ReturnType<typeof animate> | undefined;
    const stop = inView(element, () => {
      if (media.matches) return;
      playback = animate(element, { opacity: [0, 1], transform: ['translateY(10px)', 'translateY(0px)'] }, { duration, delay, ease: [.22, 1, .36, 1] });
    }, { margin: '0px 0px -25px 0px' });
    const onPreferenceChange = () => { if (media.matches) playback?.complete(); };
    media.addEventListener('change', onPreferenceChange);
    return () => { stop(); media.removeEventListener('change', onPreferenceChange); playback?.cancel(); };
  }, [delay, duration]);

  const Tag = as;
  return <Tag ref={(node: HTMLElement | null) => { ref.current = node; }} id={id} className={className}>{children}</Tag>;
}
