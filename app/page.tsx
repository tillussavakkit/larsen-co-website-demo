import Image from 'next/image';
import Link from 'next/link';
import { ContactCta } from '@/components/contact-cta';
import { company, competencies, owners, projects } from '@/data/site';
import { siteUrl } from '@/lib/site-url';

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: company.name,
  url: siteUrl,
  telephone: company.phone,
  email: company.email,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Nuuk',
    addressCountry: 'GL',
  },
};

export default function Home() {
  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="hero" aria-labelledby="hero-heading">
        <Image
          src="/images/larsen-co/work/11-waterfront-drilling-earthworks.jpg"
          alt="Larsen & Co.-maskiner arbejder i klippe ved vandet"
          fill
          priority
          sizes="100vw"
          className="hero__image"
        />
        <div className="hero__shade" />

        <div className="hero__content shell">
          <p className="eyebrow">Larsen & Co. · Nuuk</p>
          <h1 id="hero-heading">Mere end 45 års erfaring</h1>
          <p className="hero__lead">
            Minør- og sprængningsarbejde samt jord- og terrænarbejde.
          </p>
          <p className="hero__body">Entreprenør- og minørfirma med base i Nuuk.</p>
          <div className="hero__actions">
            <Link href="/kontakt" className="button button--yellow">
              Kontakt os <span aria-hidden="true">↗</span>
            </Link>
            <Link href="/kompetencer" className="button button--glass">
              Se vores kompetencer
            </Link>
          </div>
        </div>

        <div className="hero__foot shell" aria-label="Erfaring">
          <strong>{company.experienceYears}</strong>
          <span>{company.description}</span>
          <span className="hero__scroll" aria-hidden="true">
            Scroll <i>↓</i>
          </span>
        </div>
      </section>

      <section className="experience-section section-pad" aria-labelledby="experience-heading">
        <div className="experience-grid shell">
          <p className="section-kicker">Erfaring, der kan mærkes</p>
          <div className="experience-number" aria-hidden="true">
            <strong>45</strong>
            <span>+</span>
          </div>
          <div className="experience-copy">
            <h2 id="experience-heading">
              Et stærkt udgangspunkt for arbejdet i fjeld og terræn.
            </h2>
            <p>{company.description}</p>
            <Link href="/om-os" className="text-link">
              Mød Larsen & Co. <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="competencies-home section-pad section-dark" aria-labelledby="competencies-heading">
        <div className="section-heading shell">
          <div>
            <p className="section-kicker section-kicker--yellow">Kompetencer</p>
            <h2 id="competencies-heading">To tydelige fagområder.</h2>
          </div>
          <p>
            Larsen & Co. arbejder med minør- og sprængningsarbejde samt jord- og
            terrænarbejde.
          </p>
        </div>

        <div className="competency-showcase shell">
          {competencies.map((competency) => (
            <article className="competency-panel" key={competency.id}>
              <div className="competency-panel__image">
                <Image
                  src={competency.image}
                  alt={competency.alt}
                  fill
                  sizes="(max-width: 850px) 100vw, 50vw"
                />
              </div>
              <div className="competency-panel__content">
                <span>{competency.number}</span>
                <h3>{competency.title}</h3>
                <p>{competency.description}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="section-action shell">
          <Link href="/kompetencer" className="button button--outline-light">
            Se alle kompetencer <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      <section className="work-story section-pad" aria-labelledby="work-story-heading">
        <div className="work-story__heading shell">
          <p className="section-kicker">Virkelige arbejdssteder</p>
          <h2 id="work-story-heading">Fotografierne fortæller historien.</h2>
          <p>
            Autentiske billeder fra Larsen & Co.s arbejde viser materiel, terræn
            og hverdagen omkring opgaverne.
          </p>
        </div>

        <div className="work-story__grid shell">
          <figure className="story-image story-image--tall">
            <Image
              src="/images/larsen-co/work/03-trench-earthworks.jpg"
              alt="Udgravet rende i stenet terræn"
              fill
              sizes="(max-width: 760px) 100vw, 40vw"
            />
            <figcaption>Jord & terræn</figcaption>
          </figure>
          <figure className="story-image story-image--wide">
            <Image
              src="/images/larsen-co/work/05-bell-dumper-excavator.jpg"
              alt="Dumper og gravemaskine på et stenet arbejdsområde"
              fill
              sizes="(max-width: 760px) 100vw, 60vw"
            />
            <figcaption>Tungt materiel</figcaption>
          </figure>
          <figure className="story-image story-image--small">
            <Image
              src="/images/larsen-co/work/08-surveying-hillside-excavation.jpg"
              alt="Opmåling på en stor udgravning i fjeldterræn"
              fill
              sizes="(max-width: 760px) 100vw, 40vw"
            />
            <figcaption>Arbejde i terræn</figcaption>
          </figure>
        </div>
      </section>

      <section className="projects-preview section-pad" aria-labelledby="projects-preview-heading">
        <div className="section-heading shell">
          <div>
            <p className="section-kicker">Udvalgt arbejde</p>
            <h2 id="projects-preview-heading">Fra arbejdspladsen.</h2>
          </div>
          <p>
            Et udvalg af virkelige billeder fra Larsen & Co.s arbejde i fjeld,
            jord og terræn.
          </p>
        </div>

        <div className="preview-strip">
          {projects.slice(5, 9).map((project, index) => (
            <Link href="/projekter" className="preview-strip__item" key={project.id}>
              <Image
                src={project.image}
                alt={project.alt}
                fill
                sizes="(max-width: 700px) 86vw, 25vw"
              />
              <span>0{index + 1}</span>
            </Link>
          ))}
        </div>

        <div className="section-action shell">
          <Link href="/projekter" className="text-link">
            Se hele billedarkivet <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      <section className="about-preview section-pad section-dark" aria-labelledby="about-preview-heading">
        <div className="about-preview__grid shell">
          <div className="about-preview__visual">
            <div className="about-preview__image about-preview__image--main">
              <Image
                src="/images/larsen-co/work/07-foundation-excavators.jpg"
                alt="To gravemaskiner på et arbejdsområde"
                fill
                sizes="(max-width: 850px) 100vw, 55vw"
              />
            </div>
            <div className="about-preview__image about-preview__image--accent">
              <Image
                src="/images/larsen-co/work/10-machinery-building-site.jpg"
                alt="Entreprenørmaskiner ved en byggeplads"
                fill
                sizes="(max-width: 850px) 52vw, 25vw"
              />
            </div>
          </div>

          <div className="about-preview__copy">
            <p className="section-kicker section-kicker--yellow">Om Larsen & Co.</p>
            <h2 id="about-preview-heading">Forankret i Nuuk.</h2>
            <p className="large-copy">
              Larsen & Co. er et entreprenør- og minørfirma med base i Nuuk.
            </p>
            <p>
              Mere end 45 års erfaring med minør-, sprængnings-, jord- og
              terrænarbejde er et stærkt fagligt udgangspunkt.
            </p>
            <Link href="/om-os" className="button button--outline-light">
              Læs om virksomheden <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="owners-home section-pad" aria-labelledby="owners-heading">
        <div className="owners-home__heading shell">
          <div>
            <p className="section-kicker">Mød ejerne</p>
            <h2 id="owners-heading">Jimmy & Benny.</h2>
          </div>
          <p>
            Jimmy H. Rødgaard og Benny Larsen er ejere af Larsen & Co.
          </p>
        </div>

        <div className="owners-grid shell">
          {owners.map((owner) => (
            <article className="owner-card" key={owner.name}>
              <div className="owner-card__image">
                <Image
                  src={owner.image}
                  alt={owner.alt}
                  fill
                  sizes="(max-width: 700px) 100vw, 50vw"
                  style={{ objectPosition: owner.imagePosition }}
                />
              </div>
              <div className="owner-card__content">
                <span>{owner.role}</span>
                <h3>{owner.name}</h3>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="winter-feature" aria-labelledby="winter-heading">
        <Image
          src="/images/larsen-co/work/12-winter-night-excavator.jpg"
          alt="Gravemaskine arbejder i sne og vintermørke"
          fill
          sizes="100vw"
          className="winter-feature__image"
        />
        <div className="winter-feature__shade" />
        <div className="winter-feature__content shell">
          <p className="section-kicker section-kicker--yellow">Nuuk · Greenland</p>
          <h2 id="winter-heading">Erfaring fra grønlandske forhold.</h2>
          <p>
            Billeder fra sne og vintermørke giver et autentisk indblik i
            virkeligheden omkring arbejdet i Grønland.
          </p>
        </div>
      </section>

      <ContactCta />
    </main>
  );
}
