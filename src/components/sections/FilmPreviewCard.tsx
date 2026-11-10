'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import villaImageLoader from '@/lib/villa-image-loader';
import styles from './HomeVideosSection.module.css';

export type Film = { id: string; title: string; href: string; poster: string; alt: string };
type Player = { playVideo(): void; pauseVideo(): void; mute(): void; destroy(): void };
type PlayerEvent = { target: Player; data: number };
type YouTubeAPI = { Player: new (frame: HTMLIFrameElement, options: { events: { onReady(event: PlayerEvent): void; onStateChange(event: PlayerEvent): void } }) => Player };
declare global {
  interface Window { YT?: YouTubeAPI; onYouTubeIframeAPIReady?: () => void }
}
let apiPromise: Promise<YouTubeAPI> | undefined;
function loadPlayerAPI() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (!apiPromise) apiPromise = new Promise<YouTubeAPI>((resolve, reject) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { previous?.(); if (window.YT?.Player) resolve(window.YT); };
    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      script.onerror = () => reject(new Error('YouTube player could not load'));
      document.head.appendChild(script);
    }
  });
  return apiPromise;
}

export function FilmPreviewCard({ item, vertical, active, onActivate, onLeave }: {
  item: Film; vertical?: boolean; active: boolean; onActivate(): void; onLeave(): void;
}) {
  const [loaded, setLoaded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [origin, setOrigin] = useState('');
  const frame = useRef<HTMLIFrameElement>(null);
  const player = useRef<Player | null>(null);
  const intent = useRef(false);

  function activate() { setOrigin(window.location.origin); setLoaded(true); onActivate(); }
  useEffect(() => {
    intent.current = active;
    if (!player.current) return;
    if (active) { player.current.mute(); player.current.playVideo(); }
    else player.current.pauseVideo();
  }, [active]);
  useEffect(() => {
    if (!loaded) return;
    let disposed = false;
    let instance: Player | undefined;
    void loadPlayerAPI().then(api => {
      if (disposed || !frame.current) return;
      instance = new api.Player(frame.current, { events: {
        onReady: event => {
          if (disposed) return;
          player.current = event.target;
          event.target.mute();
          if (intent.current) event.target.playVideo();
          else event.target.pauseVideo();
        },
        onStateChange: event => {
          if (disposed) return;
          if (event.data === 1 && !intent.current) { event.target.pauseVideo(); return; }
          setPlaying(event.data === 1);
        },
      } });
    }).catch(() => { /* The cover and direct YouTube link remain available. */ });
    return () => { disposed = true; player.current = null; instance?.destroy(); };
  }, [loaded]);

  return <li className={`${styles.card} ${vertical ? styles.shortCard : ''}`}
    data-film-id={item.id} data-playing={active && playing}
    onPointerEnter={event => { if (event.pointerType === 'mouse') activate(); }}
    onPointerLeave={event => { if (event.pointerType === 'mouse') { player.current?.pauseVideo(); onLeave(); } }}>
    <a className={styles.cover} href={item.href} target="_blank" rel="noopener noreferrer" aria-label={`Play ${item.title}`}
      onClick={event => { event.preventDefault(); activate(); }}>
      <Image src={item.poster} alt={item.alt} fill loader={villaImageLoader} sizes={vertical ? '(max-width: 700px) 85vw, 22vw' : '(max-width: 700px) 90vw, 40vw'} />
      <span className={styles.shade} />
      <span className={`${styles.play} ${vertical ? styles.shortPlay : ''}`} aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 4v16l13-8z" /></svg></span>
      <span className={styles.caption}>{item.title}</span>
    </a>
    {loaded && <iframe ref={frame} className={`${styles.player} ${active && playing ? styles.playerVisible : ''}`}
      title={item.title} src={`https://www.youtube-nocookie.com/embed/${item.id}?enablejsapi=1&mute=1&playsinline=1&rel=0&origin=${encodeURIComponent(origin)}`}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />}
    <a className={styles.sourceLink} href={item.href} target="_blank" rel="noopener noreferrer" aria-label={`Watch ${item.title} on YouTube`}>↗</a>
  </li>;
}
