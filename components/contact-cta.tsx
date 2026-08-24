import Link from 'next/link';
import { company } from '@/data/site';

export function ContactCta() {
  return (
    <section className="contact-cta" aria-labelledby="contact-cta-heading">
      <div className="contact-cta__inner shell">
        <div>
          <p className="eyebrow eyebrow--dark">Kontakt Larsen & Co.</p>
          <h2 id="contact-cta-heading">Lad os tale om opgaven.</h2>
        </div>
        <div className="contact-cta__actions">
          <Link href="/kontakt" className="button button--dark">
            Send en forespørgsel <span aria-hidden="true">↗</span>
          </Link>
          <a href={company.phoneHref} className="contact-cta__phone">
            <span>Ring direkte</span>
            {company.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
