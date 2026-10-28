'use client';

import { useEffect } from 'react';

export function HeadingSelection() {
  useEffect(() => {
    function selectHeading(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element) || target.closest('button, a, input, textarea')) return;
      const heading = target.closest('h1, h2, h3');
      if (heading) window.getSelection()?.selectAllChildren(heading);
    }
    document.addEventListener('dblclick', selectHeading);
    return () => document.removeEventListener('dblclick', selectHeading);
  }, []);
  return null;
}
