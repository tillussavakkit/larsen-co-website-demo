import Link from 'next/link';
import { NewsCard } from '@/app/nyheder/news-card';
import styles from '@/components/news.module.css';
import { listPublishedArticles } from '@/lib/cms-repository';
import { getSiteContent } from '@/lib/site-content';

type LatestNewsProps = {
  limit?: number;
};

export async function LatestNews({ limit = 3 }: LatestNewsProps) {
  const [articles, content] = await Promise.all([
    listPublishedArticles(Math.max(1, limit)),
    getSiteContent('home'),
  ]);
  if (!articles.length) return null;

  return (
    <section className={styles.latestNews} aria-labelledby="latest-news-heading">
      <div className="shell">
        <div className={styles.latestHeading}>
          <div>
            <p className={styles.sectionLabel}>{content['home.news.kicker']}</p>
            <h2 id="latest-news-heading">{content['home.news.title']}</h2>
          </div>
          <Link href="/nyheder" className={styles.headingLink}>
            Se alle nyheder
          </Link>
        </div>

        <div className={styles.latestGrid}>
          {articles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
