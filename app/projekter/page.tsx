import { ContactCta } from '@/components/contact-cta';
import { PageHero } from '@/components/page-hero';
import { ProjectGallery } from '@/components/project-gallery';
import { createPageMetadata } from '@/lib/page-metadata';

export const metadata = createPageMetadata({
  title: 'Projekter',
  description:
    'Se et visuelt udvalg af Larsen & Co.s arbejde med virkelige fotografier fra arbejdssteder.',
  path: '/projekter',
});

export default function ProjectsPage() {
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Projekter"
        title="Arbejdet i billeder."
        description="Et visuelt arkiv med virkelige fotografier fra Larsen & Co.s arbejdssteder."
        image="/images/larsen-co/work/05-bell-dumper-excavator.jpg"
        alt="Dumper og gravemaskine på et stenet arbejdsområde"
        imagePosition="center 56%"
      />

      <section className="projects-intro section-pad" aria-labelledby="projects-intro-heading">
        <div className="page-intro shell">
          <p className="section-kicker">Visuelt projektarkiv</p>
          <h2 id="projects-intro-heading">Arbejdet får lov at tale først.</h2>
          <p>
            Fotografier fra virkelige arbejdssteder præsenteres under neutrale
            faglige kategorier og giver et direkte indblik i materiel, fjeld,
            terræn og hverdagen omkring arbejdet.
          </p>
        </div>
      </section>

      <section className="gallery-section shell" aria-label="Billeder fra Larsen & Co.s arbejde">
        <ProjectGallery />
      </section>

      <section className="project-data-note section-pad" aria-labelledby="project-data-heading">
        <div className="project-data-note__inner shell">
          <span>Direkte kontakt</span>
          <h2 id="project-data-heading">Har du en opgave i tankerne?</h2>
          <p>
            Kontakt Larsen & Co. for at fortælle om opgaven og få afklaret de
            næste skridt.
          </p>
        </div>
      </section>

      <ContactCta />
    </main>
  );
}
