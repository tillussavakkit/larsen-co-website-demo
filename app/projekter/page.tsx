import { ContactCta } from '@/components/contact-cta';
import { PageHero } from '@/components/page-hero';
import { ProjectGallery } from '@/components/project-gallery';
import { createPageMetadata } from '@/lib/page-metadata';
import { getSiteContent } from '@/lib/site-content';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const content = await getSiteContent('projects');
  return createPageMetadata({
    title: content['projects.seo.title'],
    description: content['projects.seo.description'],
    path: '/projekter',
  });
}

export default async function ProjectsPage() {
  const content = await getSiteContent('projects');
  return (
    <main id="main-content">
      <PageHero
        eyebrow={content['projects.hero.eyebrow']}
        title={content['projects.hero.title']}
        description={content['projects.hero.body']}
        image="/images/larsen-co/work/05-bell-dumper-excavator.jpg"
        alt="Dumper og gravemaskine på et stenet arbejdsområde"
        imagePosition="center 56%"
      />

      <section className="projects-intro section-pad" aria-labelledby="projects-intro-heading">
        <div className="page-intro shell">
          <p className="section-kicker">{content['projects.intro.kicker']}</p>
          <h2 id="projects-intro-heading">{content['projects.intro.title']}</h2>
          <p>{content['projects.intro.body']}</p>
        </div>
      </section>

      <section className="gallery-section shell" aria-label="Billeder fra Larsen & Co.s arbejde">
        <ProjectGallery />
      </section>

      <section className="project-data-note section-pad" aria-labelledby="project-data-heading">
        <div className="project-data-note__inner shell">
          <span>{content['projects.closing.kicker']}</span>
          <h2 id="project-data-heading">{content['projects.closing.title']}</h2>
          <p>{content['projects.closing.body']}</p>
        </div>
      </section>

      <ContactCta />
    </main>
  );
}
