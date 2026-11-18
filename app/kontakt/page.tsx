import { ContactForm } from '@/components/contact-form';
import { PageHero } from '@/components/page-hero';
import { createPageMetadata } from '@/lib/page-metadata';
import { getSiteContent } from '@/lib/site-content';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const content = await getSiteContent('contact');
  return createPageMetadata({
    title: content['contact.seo.title'],
    description: `${content['contact.seo.description']} Telefon: ${content['global.company.phone']}.`,
    path: '/kontakt',
  });
}

export default async function ContactPage() {
  const content = await getSiteContent('contact');
  const phone = content['global.company.phone'];
  const phoneHref = `tel:${phone.replace(/[^+\d]/g, '')}`;
  return (
    <main id="main-content">
      <PageHero
        eyebrow={content['contact.hero.eyebrow']}
        title={content['contact.hero.title']}
        description={content['contact.hero.body']}
        image="/images/larsen-co/work/10-machinery-building-site.jpg"
        alt="Entreprenørmaskiner ved en byggeplads"
        imagePosition="center 60%"
      />

      <section className="contact-section section-pad" aria-labelledby="contact-form-heading">
        <div className="contact-layout shell">
          <aside className="contact-details">
            <p className="section-kicker">{content['contact.details.kicker']}</p>
            <h2 id="contact-form-heading">{content['global.company.name']}</h2>
            <div className="contact-details__item">
              <span>Telefon</span>
              <a href={phoneHref}>{phone}</a>
            </div>
            <div className="contact-details__item">
              <span>Lokation</span>
              <strong>{content['global.company.location']}</strong>
            </div>
          </aside>

          <div className="contact-form-wrap">
            <div className="contact-form-wrap__heading">
              <span>{content['contact.form.kicker']}</span>
              <h2>{content['contact.form.title']}</h2>
              <p>{content['contact.form.body']}</p>
            </div>
            <ContactForm phone={phone} />
          </div>
        </div>
      </section>
    </main>
  );
}
