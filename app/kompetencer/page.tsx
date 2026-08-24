import Image from 'next/image';
import { ContactCta } from '@/components/contact-cta';
import { PageHero } from '@/components/page-hero';
import { competencies } from '@/data/site';
import { createPageMetadata } from '@/lib/page-metadata';

export const metadata = createPageMetadata({
  title: 'Kompetencer',
  description:
    'Larsen & Co. arbejder med minør- og sprængningsarbejde samt jord- og terrænarbejde.',
  path: '/kompetencer',
});

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

export default function CompetenciesPage() {
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Kompetencer"
        title="Faglighed i fjeld og terræn."
        description="Minør- og sprængningsarbejde samt jord- og terrænarbejde."
        image="/images/larsen-co/work/02-rock-excavation-blue-building.jpg"
        alt="Gravemaskine arbejder i stenet terræn ved en blå bygning"
        imagePosition="center 58%"
      />

      <section className="competencies-intro section-pad" aria-labelledby="competencies-intro-heading">
        <div className="page-intro shell">
          <p className="section-kicker">Fagområder</p>
          <h2 id="competencies-intro-heading">Erfaring i fjeld og terræn.</h2>
          <p>
            Larsen & Co. har mere end 45 års erfaring inden for minør- og
            sprængningsarbejde samt jord- og terrænarbejde.
          </p>
        </div>
      </section>

      <section className="competencies-detail section-dark" aria-label="Kompetencer">
        {competencies.map((competency, index) => (
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
              <p>
                De viste fotografier er fra Larsen & Co.s virkelige arbejde.
                Konkrete ydelser og opgavens rammer afklares ved direkte kontakt.
              </p>
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
          <p className="section-kicker">Direkte dialog</p>
          <div>
            <h2 id="competencies-note-heading">Lad os tale om opgaven.</h2>
            <p>
              Kontakt Larsen & Co. for at afklare opgavens rammer og de relevante
              fagområder.
            </p>
          </div>
        </div>
      </section>

      <ContactCta />
    </main>
  );
}
