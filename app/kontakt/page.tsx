import { ContactForm } from '@/components/contact-form';
import { PageHero } from '@/components/page-hero';
import { company } from '@/data/site';
import { createPageMetadata } from '@/lib/page-metadata';

export const metadata = createPageMetadata({
  title: 'Kontakt',
  description: `Kontakt Larsen & Co. i Nuuk på ${company.phone} eller send en forespørgsel via kontaktformularen.`,
  path: '/kontakt',
});

export default function ContactPage() {
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Kontakt"
        title="Fortæl os om opgaven."
        description="Send en forespørgsel via formularen eller ring direkte til Larsen & Co."
        image="/images/larsen-co/work/10-machinery-building-site.jpg"
        alt="Entreprenørmaskiner ved en byggeplads"
        imagePosition="center 60%"
      />

      <section className="contact-section section-pad" aria-labelledby="contact-form-heading">
        <div className="contact-layout shell">
          <aside className="contact-details">
            <p className="section-kicker">Direkte kontakt</p>
            <h2 id="contact-form-heading">Larsen & Co.</h2>
            <div className="contact-details__item">
              <span>Telefon</span>
              <a href={company.phoneHref}>{company.phone}</a>
            </div>
            <div className="contact-details__item">
  <span>E-mail</span>
  <a href={company.emailHref}>{company.email}</a>
</div>
            <div className="contact-details__item">
              <span>Lokation</span>
              <strong>{company.location}</strong>
            </div>
          </aside>

          <div className="contact-form-wrap">
            <div className="contact-form-wrap__heading">
              <span>Forespørgsel</span>
              <h2>Send en besked</h2>
              <p>
                Udfyld kontaktoplysningerne og giv en kort beskrivelse af
                henvendelsen.
              </p>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}
