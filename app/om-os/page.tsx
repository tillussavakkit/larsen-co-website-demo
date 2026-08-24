import Image from 'next/image';
import Link from 'next/link';
import { ContactCta } from '@/components/contact-cta';
import { PageHero } from '@/components/page-hero';
import { company, competencies, owners } from '@/data/site';
import { createPageMetadata } from '@/lib/page-metadata';

export const metadata = createPageMetadata({
  title: 'Om os',
  description:
    'Mød Larsen & Co. i Nuuk og læs om mere end 45 års erfaring med minør-, sprængnings-, jord- og terrænarbejde.',
  path: '/om-os',
});

export default function AboutPage() {
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Om Larsen & Co."
        title="Erfaring. Materiel. Nuuk."
        description="Et entreprenør- og minørfirma med mere end 45 års erfaring inden for minør-, sprængnings-, jord- og terrænarbejde."
        image="/images/larsen-co/work/06-road-earthworks-nuuk.jpg"
        alt="Jordarbejde ved en vej"
        imagePosition="center 56%"
      />

      <section className="about-intro section-pad" aria-labelledby="about-intro-heading">
        <div className="about-intro__grid shell">
          <p className="section-kicker">Larsen & Co. · Nuuk</p>
          <div>
            <h2 id="about-intro-heading">Erfaringen er udgangspunktet.</h2>
            <p className="large-copy">
              Larsen & Co. har mere end 45 års erfaring med minør- og
              sprængningsarbejde samt jord- og terrænarbejde.
            </p>
            <p>
              Larsen & Co. har base i Nuuk. Virksomhedens egne fotografier giver
              et direkte indblik i materiellet, terrænet og arbejdet.
            </p>
          </div>
          <div className="about-intro__stat">
            <strong>{company.experienceYears}</strong>
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
            <p className="section-kicker section-kicker--yellow">Faglig retning</p>
            <h2 id="about-competencies-heading">Kerneområderne.</h2>
          </div>
          <div className="about-competencies__list">
            {competencies.map((competency) => (
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
          <p className="section-kicker">Mød ejerne</p>
          <h2 id="about-owners-heading">Menneskerne bag.</h2>
          <p>
            Jimmy H. Rødgaard og Benny Larsen står som ejere af Larsen & Co.
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

        <div className="section-action shell">
          <Link href="/kontakt" className="text-link">
            Kontakt Larsen & Co. <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      <ContactCta />
    </main>
  );
}
