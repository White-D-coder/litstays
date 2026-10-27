'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { animate } from 'motion/mini';
import { inView } from 'motion';

// Content is visible in server HTML and remains usable when JavaScript fails.
export function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    return inView(ref.current, element => {
      animate(element, { opacity: [0, 1], transform: ['translateY(20px)', 'translateY(0px)'] }, { duration: .7, delay, ease: [.22, 1, .36, 1] });
    }, { margin: '0px 0px -35px 0px' });
  }, [delay]);
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}
