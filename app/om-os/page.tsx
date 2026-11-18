import Image from 'next/image';
import Link from 'next/link';
import { ContactCta } from '@/components/contact-cta';
import { PageHero } from '@/components/page-hero';
import { competencies, owners } from '@/data/site';
import { createPageMetadata } from '@/lib/page-metadata';
import { getSiteContent } from '@/lib/site-content';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const content = await getSiteContent('about');
  return createPageMetadata({
    title: content['about.seo.title'],
    description: content['about.seo.description'],
    path: '/om-os',
  });
}

export default async function AboutPage() {
  const content = await getSiteContent('about', 'competencies');
  const pageCompetencies = competencies.map((competency, index) => ({
    ...competency,
    description:
      content[index === 0 ? 'competencies.minor.body' : 'competencies.earth.body'],
  }));

  return (
    <main id="main-content">
      <PageHero
        eyebrow={content['about.hero.eyebrow']}
        title={content['about.hero.title']}
        description={content['about.hero.body']}
        image="/images/larsen-co/work/06-road-earthworks-nuuk.jpg"
        alt="Jordarbejde ved en vej"
        imagePosition="center 56%"
      />

      <section className="about-intro section-pad" aria-labelledby="about-intro-heading">
        <div className="about-intro__grid shell">
          <p className="section-kicker">{content['about.intro.kicker']}</p>
          <div>
            <h2 id="about-intro-heading">{content['about.intro.title']}</h2>
            <p className="large-copy">{content['about.intro.lead']}</p>
            <p>{content['about.intro.body']}</p>
          </div>
          <div className="about-intro__stat">
            <strong>{content['global.company.experience']}</strong>
            <span>års erfaring</span>
          </div>
        </div>
      </section>

      <section className="about-image-band" aria-label="Larsen & Co. i arbejde">
        <div className="about-image-band__large">
          <Image
            src="/images/larsen-co/work/11-waterfront-drilling-earthworks.jpg"
            alt="Larsen & Co.-maskiner arbejder i klippe ved vandet"
            fill
            sizes="75vw"
          />
        </div>
        <div className="about-image-band__small">
          <Image
            src="/images/larsen-co/work/14-deep-excavation-worker.jpg"
            alt="Medarbejder i en dyb udgravning i klippe"
            fill
            sizes="25vw"
          />
        </div>
      </section>

      <section className="about-competencies section-pad section-dark" aria-labelledby="about-competencies-heading">
        <div className="about-competencies__grid shell">
          <div>
            <p className="section-kicker section-kicker--yellow">
              {content['about.competencies.kicker']}
            </p>
            <h2 id="about-competencies-heading">
              {content['about.competencies.title']}
            </h2>
          </div>
          <div className="about-competencies__list">
            {pageCompetencies.map((competency) => (
              <article key={competency.id}>
                <span>{competency.number}</span>
                <h3>{competency.title}</h3>
                <p>{competency.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="owners-page section-pad" aria-labelledby="about-owners-heading">
        <div className="owners-page__intro shell">
          <p className="section-kicker">{content['about.owners.kicker']}</p>
          <h2 id="about-owners-heading">{content['about.owners.title']}</h2>
          <p>{content['about.owners.body']}</p>
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
                <div className="owner-name-contact">
                  <h3>{owner.name}</h3>
                  <a href={`mailto:${owner.email}`} style={{ display: "block", marginTop: "0.45rem", fontSize: "0.9rem", color: "inherit", textDecoration: "underline", textUnderlineOffset: "3px" }}>
                    {owner.email}
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="section-action shell">
          <Link href="/kontakt" className="text-link">
            Kontakt Larsen & Co.
          </Link>
        </div>
      </section>

      <ContactCta />
    </main>
  );
}
