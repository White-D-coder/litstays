'use client';

import { useState } from 'react';
import Image from 'next/image';
import { moments } from '@/lib/site-content';
import { Reveal } from '../ui/Reveal';

export function ExperienceSection() {
  const [active, setActive] = useState(0);
  return <section className="experience" id="experience" aria-labelledby="experience-heading"><div className="experience-story"><Reveal><p className="eyebrow">THE EXPERIENCE</p><h2 id="experience-heading">The best plans? <em>A little less planned.</em></h2><p className="experience-intro">Make space for the moments in between.</p></Reveal><div className="moments">{moments.map((moment, i) => <div className={`moment ${active === i ? 'is-active' : ''}`} key={moment.number}><h3><button aria-expanded={active === i} aria-controls={`moment-${i}`} onClick={() => setActive(i)}><span className="moment-number">{moment.number}</span><span>{moment.title}</span><span className="moment-plus" aria-hidden="true">{active === i ? '−' : '+'}</span></button></h3><div id={`moment-${i}`} hidden={active !== i} className="moment-description"><p>{moment.description}</p></div></div>)}</div></div><div className="experience-photo image-frame"><Image src={`${moments[active].image}.jpg`} alt={moments[active].alt} fill sizes="(max-width: 700px) 100vw, 48vw"/><span className="experience-photo-label">THE PLEASURE OF TAKING YOUR TIME</span></div></section>;
}
