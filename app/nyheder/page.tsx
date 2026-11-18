import type { Metadata } from 'next';
import Link from 'next/link';
import styles from '@/components/news.module.css';
import { listPublishedArticles } from '@/lib/cms-repository';
import { getSiteContent } from '@/lib/site-content';
import { siteUrl } from '@/lib/site-url';
import { NewsCard } from './news-card';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent('news');
  const title = content['news.seo.title'];
  const description = content['news.seo.description'];
  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}/nyheder` },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/nyheder`,
      type: 'website',
      locale: 'da_DK',
      siteName: 'Larsen & Co.',
      images: ['/og.png'],
    },
  };
}

export default async function NewsPage() {
  const [articles, content] = await Promise.all([
    listPublishedArticles(1_000),
    getSiteContent('news'),
  ]);

  return (
    <main id="main-content" className={styles.indexPage}>
      <header className={styles.newsHero}>
        <div className={`shell ${styles.newsHeroInner}`}>
          <div>
            <p className={styles.kicker}>{content['news.hero.kicker']}</p>
            <h1>{content['news.hero.title']}</h1>
          </div>
          <p>{content['news.hero.body']}</p>
        </div>
      </header>

      <section className={styles.newsArchive} aria-labelledby="news-archive-heading">
        <div className="shell">
          <div className={styles.archiveHeading}>
            <div>
              <p className={styles.sectionLabel}>{content['news.archive.kicker']}</p>
              <h2 id="news-archive-heading">{content['news.archive.title']}</h2>
            </div>
            {articles.length ? (
              <p>
                {articles.length} {articles.length === 1 ? 'nyhed' : 'nyheder'}
              </p>
            ) : null}
          </div>

          {articles.length ? (
            <div className={styles.articleGrid}>
              {articles.map((article, index) => (
                <NewsCard key={article.id} article={article} featured={index === 0} />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p className={styles.sectionLabel}>{content['news.empty.kicker']}</p>
              <h2>{content['news.empty.title']}</h2>
              <p>{content['news.empty.body']}</p>
              <div className={styles.emptyActions}>
                <Link href="/projekter" className={styles.primaryLink}>
                  Se vores arbejde
                </Link>
                <Link href="/kompetencer" className={styles.secondaryLink}>
                  Se kompetencer
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
