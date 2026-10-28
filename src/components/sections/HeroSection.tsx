'use client';

import Image, { getImageProps } from 'next/image';
import { useRef } from 'react';
import { LazyMotion, domAnimation, m, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { Arrow } from '../ui/Icons';
import imageLoader from '@/lib/image-loader';

export function HeroSection() {
  const mobile = getImageProps({ src: 'aerial-mobile.jpg', width: 480, height: 854, alt: '', sizes: '100vw', loader: imageLoader }).props;
  const desktop = getImageProps({ src: 'aerial.jpg', width: 1920, height: 1432, alt: '', sizes: '100vw', loader: imageLoader }).props;
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0, .55], [1, 0]);
  const y = useTransform(scrollYProgress, [0, .7], [0, -65]);
  return <section id="home" className="hero" ref={ref} aria-labelledby="hero-heading">
    <link rel="preload" as="image" imageSrcSet={mobile.srcSet} imageSizes="100vw" media="(max-width: 600px)" fetchPriority="high"/>
    <link rel="preload" as="image" imageSrcSet={desktop.srcSet} imageSizes="100vw" media="(min-width: 601px)" fetchPriority="high"/>
    <div id="nav-sentinel"/>
    <div className="hero-sticky">
      <picture><source media="(max-width: 600px)" srcSet={mobile.srcSet} sizes="100vw"/><Image className="hero-photo" src="aerial.jpg" alt="Villa Archway nestled in trees beneath the green hills of Virar, its arched windows glowing in the evening" fill loading="eager" fetchPriority="high" sizes="100vw" /></picture>
      <div className="hero-shade"/>
      <LazyMotion features={domAnimation}><m.div className="hero-content" style={reduced ? undefined : { opacity, y }}>
        <p className="eyebrow hero-enter">PRIVATE STAYS. PERSONAL MOMENTS.</p>
        <h1 id="hero-heading">Some places stay <em>with you.</em></h1>
        <p className="hero-description hero-enter">A place to slow down. Room to reconnect.<br/>A little time that’s entirely your own.</p>
        <div className="hero-actions hero-enter"><a href="#enquire" className="button button-ivory">Enquire about your stay <Arrow diagonal/></a><a href="#bungalow" className="text-link">Explore the bungalow <Arrow/></a></div>
      </m.div></LazyMotion>
      <div className="hero-bottom hero-enter"><a href="#introduction" className="scroll-cue"><span className="scroll-line"/>SCROLL TO SLOW DOWN</a><span className="hero-footnote">Thoughtfully stayed.<br/><span>Beautifully remembered.</span></span></div>
      <span className="hero-vertical" aria-hidden="true">THE ART OF DOING A LITTLE LESS</span>
    </div>
  </section>;
}
