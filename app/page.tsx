import Image from 'next/image';
import Link from 'next/link';
import { ContactCta } from '@/components/contact-cta';
import { LatestNews } from '@/components/latest-news';
import { competencies, owners, projects } from '@/data/site';
import { serializeJsonLd } from '@/lib/json-ld';
import { getSiteContent } from '@/lib/site-content';
import { siteUrl } from '@/lib/site-url';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const content = await getSiteContent('home');
  const title = content['home.seo.title'];
  const description = content['home.seo.description'];
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: siteUrl },
    openGraph: { title, description, url: siteUrl },
    twitter: { title, description },
  };
}

export default async function Home() {
  const content = await getSiteContent('home', 'competencies');
  const name = content['global.company.name'];
  const phone = content['global.company.phone'];
  const description = content['global.company.description'];
  const experience = content['global.company.experience'];
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name,
    url: siteUrl,
    telephone: phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Nuuk',
      addressCountry: 'GL',
    },
  };
  const pageCompetencies = competencies.map((competency, index) => ({
    ...competency,
    description:
      content[index === 0 ? 'competencies.minor.body' : 'competencies.earth.body'],
  }));

  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
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
          <p className="eyebrow">{content['home.hero.eyebrow']}</p>
          <h1 id="hero-heading">{content['home.hero.title']}</h1>
          <p className="hero__lead">{content['home.hero.lead']}</p>
          <p className="hero__body">{content['home.hero.body']}</p>
          <div className="hero__actions">
            <Link href="/kontakt" className="button button--yellow">
              Kontakt os
            </Link>
            <Link href="/kompetencer" className="button button--glass">
              Se vores kompetencer
            </Link>
          </div>
        </div>

        <div className="hero__foot shell" aria-label="Om Larsen & Co.">
          <strong>{experience}</strong>
          <span>{description}</span>
          <span className="hero__scroll" aria-hidden="true">
            Scroll
          </span>
        </div>
      </section>

      <section className="experience-section section-pad" aria-labelledby="experience-heading">
        <div className="experience-grid shell">
          <p className="section-kicker">{content['home.experience.kicker']}</p>
          <div className="experience-number" aria-hidden="true">
            <strong>{experience}</strong>
          </div>
          <div className="experience-copy">
            <h2 id="experience-heading">{content['home.experience.title']}</h2>
            <p>{content['home.experience.body']}</p>
            <Link href="/om-os" className="text-link">
              Mød Larsen & Co.
            </Link>
          </div>
        </div>
      </section>

      <section className="competencies-home section-pad section-dark" aria-labelledby="competencies-heading">
        <div className="section-heading shell">
          <div>
            <p className="section-kicker section-kicker--yellow">
              {content['home.competencies.kicker']}
            </p>
            <h2 id="competencies-heading">{content['home.competencies.title']}</h2>
          </div>
          <p>{content['home.competencies.body']}</p>
        </div>

        <div className="competency-showcase shell">
          {pageCompetencies.map((competency) => (
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
            Se alle kompetencer
          </Link>
        </div>
      </section>

      <section className="work-story section-pad" aria-labelledby="work-story-heading">
        <div className="work-story__heading shell">
          <p className="section-kicker">{content['home.work.kicker']}</p>
          <h2 id="work-story-heading">{content['home.work.title']}</h2>
          <p>{content['home.work.body']}</p>
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
            <p className="section-kicker">{content['home.projects.kicker']}</p>
            <h2 id="projects-preview-heading">{content['home.projects.title']}</h2>
          </div>
          <p>{content['home.projects.body']}</p>
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
            Se hele billedarkivet
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
            <p className="section-kicker section-kicker--yellow">{content['home.about.kicker']}</p>
            <h2 id="about-preview-heading">{content['home.about.title']}</h2>
            <p className="large-copy">{content['home.about.lead']}</p>
            <p>{content['home.about.body']}</p>
            <Link href="/om-os" className="button button--outline-light">
              Læs om virksomheden
            </Link>
          </div>
        </div>
      </section>

      <section className="owners-home section-pad" aria-labelledby="owners-heading">
        <div className="owners-home__heading shell">
          <div>
            <p className="section-kicker">{content['home.owners.kicker']}</p>
            <h2 id="owners-heading">{content['home.owners.title']}</h2>
          </div>
          <p>{content['home.owners.body']}</p>
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
          <p className="section-kicker section-kicker--yellow">{content['home.winter.kicker']}</p>
          <h2 id="winter-heading">{content['home.winter.title']}</h2>
          <p>{content['home.winter.body']}</p>
        </div>
      </section>

      <LatestNews />
      <ContactCta />
    </main>
  );
}
