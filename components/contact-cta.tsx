import Link from 'next/link';
import { getSiteContent } from '@/lib/site-content';

export async function ContactCta() {
  const content = await getSiteContent();
  const phone = content['global.company.phone'];
  const phoneHref = `tel:${phone.replace(/[^+\d]/g, '')}`;
  return (
    <section className="contact-cta" aria-labelledby="contact-cta-heading">
      <div className="contact-cta__inner shell">
        <div>
          <p className="eyebrow eyebrow--dark">{content['global.contact.kicker']}</p>
          <h2 id="contact-cta-heading">{content['global.contact.title']}</h2>
          <p className="contact-cta__body">{content['global.contact.body']}</p>
        </div>
        <div className="contact-cta__actions">
          <Link href="/kontakt" className="button button--dark">
            Send en forespørgsel
          </Link>
          <a href={phoneHref} className="contact-cta__phone">
            <span>Ring direkte</span>
            {phone}
          </a>
        </div>
      </div>
    </section>
  );
}
