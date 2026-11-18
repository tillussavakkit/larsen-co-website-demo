import Image from 'next/image';
import { ContactCta } from '@/components/contact-cta';
import { PageHero } from '@/components/page-hero';
import { competencies } from '@/data/site';
import { createPageMetadata } from '@/lib/page-metadata';
import { getSiteContent } from '@/lib/site-content';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const content = await getSiteContent('competencies');
  return createPageMetadata({
    title: content['competencies.seo.title'],
    description: content['competencies.seo.description'],
    path: '/kompetencer',
  });
}

const supportingImages = [
  {
    image: '/images/larsen-co/work/08-surveying-hillside-excavation.jpg',
    alt: 'Opmåling på en stor udgravning i fjeldterræn',
  },
  {
    image: '/images/larsen-co/work/04-excavator-trench-work.jpg',
    alt: 'Gravemaskine ved en udgravet rende',
  },
];

export default async function CompetenciesPage() {
  const content = await getSiteContent('competencies');
  const pageCompetencies = competencies.map((competency, index) => ({
    ...competency,
    description:
      content[index === 0 ? 'competencies.minor.body' : 'competencies.earth.body'],
  }));

  return (
    <main id="main-content">
      <PageHero
        eyebrow={content['competencies.hero.eyebrow']}
        title={content['competencies.hero.title']}
        description={content['competencies.hero.body']}
        image="/images/larsen-co/work/02-rock-excavation-blue-building.jpg"
        alt="Gravemaskine arbejder i stenet terræn ved en blå bygning"
        imagePosition="center 58%"
      />

      <section className="competencies-intro section-pad" aria-labelledby="competencies-intro-heading">
        <div className="page-intro shell">
          <p className="section-kicker">{content['competencies.intro.kicker']}</p>
          <h2 id="competencies-intro-heading">{content['competencies.intro.title']}</h2>
          <p>{content['competencies.intro.body']}</p>
        </div>
      </section>

      <section className="competencies-detail section-dark" aria-label="Kompetencer">
        {pageCompetencies.map((competency, index) => (
          <article className="competency-detail" key={competency.id} id={competency.id}>
            <div className="competency-detail__image">
              <Image
                src={competency.image}
                alt={competency.alt}
                fill
                sizes="(max-width: 850px) 100vw, 58vw"
              />
            </div>
            <div className="competency-detail__copy">
              <span>{competency.number}</span>
              <h2>{competency.title}</h2>
              <p>{competency.description}</p>
              <p>{content['competencies.detail.note']}</p>
            </div>
            <div className="competency-detail__support">
              <Image
                src={supportingImages[index].image}
                alt={supportingImages[index].alt}
                fill
                sizes="(max-width: 850px) 50vw, 24vw"
              />
            </div>
          </article>
        ))}
      </section>

      <section className="competencies-note section-pad" aria-labelledby="competencies-note-heading">
        <div className="competencies-note__grid shell">
          <p className="section-kicker">{content['competencies.closing.kicker']}</p>
          <div>
            <h2 id="competencies-note-heading">{content['competencies.closing.title']}</h2>
            <p>{content['competencies.closing.body']}</p>
          </div>
        </div>
      </section>

      <ContactCta />
    </main>
  );
}
