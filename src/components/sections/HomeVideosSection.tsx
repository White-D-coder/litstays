import { Arrow } from '../ui/Icons';
import styles from './HomeVideosSection.module.css';

// Individual video/Shorts URLs supplied by the owner for Website Review #2.
export const homeVideos = [
  { id: 'ZkFFq16fB2I', href: 'https://www.youtube.com/watch?v=ZkFFq16fB2I' },
  { id: 'sp49A-K0TmQ', href: 'https://www.youtube.com/watch?v=sp49A-K0TmQ' },
  { id: '9ndnJAIcA1Y', href: 'https://www.youtube.com/shorts/9ndnJAIcA1Y' },
  { id: '5RSpQchGXyk', href: 'https://www.youtube.com/shorts/5RSpQchGXyk' },
  { id: 'CCMzu5EdfyA', href: 'https://www.youtube.com/shorts/CCMzu5EdfyA' },
] as const;

export function HomeVideosSection() {
  return <section id="videos" className={`${styles.section} section-padding`} aria-labelledby="videos-heading">
    <div className={styles.heading}>
      <h2 id="videos-heading">LIT Stays <em>on film.</em></h2>
      <a className="text-link dark-link" href="https://www.youtube.com/@thelitstays" target="_blank" rel="noopener noreferrer">Watch on YouTube <Arrow diagonal /></a>
    </div>
    <ul className={styles.videos} aria-label="LIT Stays videos">
      {homeVideos.map((video, index) => <li key={video.id}>
        <iframe
          className={styles.player}
          src={`https://www.youtube-nocookie.com/embed/${video.id}`}
          title={`LIT Stays video ${index + 1}`}
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
        <a className="text-link dark-link" href={video.href} target="_blank" rel="noopener noreferrer" aria-label={`Watch LIT Stays video ${index + 1} on YouTube`}>Watch on YouTube <Arrow diagonal /></a>
      </li>)}
    </ul>
  </section>;
}
