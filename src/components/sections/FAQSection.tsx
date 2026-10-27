import { faqs, type FAQItem } from '@/lib/faqs';
import { BrandMark } from '../ui/Icons';
import { FAQMore } from './FAQMore';

function Question({ item, index }: { item: FAQItem; index: number }) {
  return <details name="lit-stays-faq" className={`lit-faq-item${index < 5 ? ' lit-faq-item--divided' : ''}`}>
    <summary>
      <span className="lit-faq-number">{String(index + 1).padStart(2, '0')}</span>
      <span className="lit-faq-question">{item.question}</span>
      <span className="lit-faq-toggle" aria-hidden="true"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 5v14M5 12h14"/></svg></span>
    </summary>
    <div className="lit-faq-answer">{item.answer.map((block, i) => block.type === 'paragraph' ? <p key={i}>{block.text}</p> : <ul key={i}>{block.items.map(text => <li key={text}>{text}</li>)}</ul>)}</div>
  </details>;
}

export function FAQSection() {
  return <section id="faq" className="lit-faq-section lit-faq" aria-labelledby="faq-heading">
    <div className="lit-faq-intro">
      <p className="lit-faq-kicker">A little more to know</p>
      <div className="lit-faq-title-row"><h2 id="faq-heading">Frequently asked questions.</h2><BrandMark className="lit-faq-title-icon"/></div>
      <p className="lit-faq-description">Everything you need to know before making yourself at home.</p>
    </div>
    <div className="lit-faq-items">
      {faqs.slice(0, 4).map((item, index) => <Question key={item.question} item={item} index={index}/>)}
      <FAQMore>{faqs.slice(4).map((item, index) => <Question key={item.question} item={item} index={index + 4}/>)}</FAQMore>
    </div>
  </section>;
}
