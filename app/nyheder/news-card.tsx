/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import styles from '@/components/news.module.css';
import type { NewsArticleSummary } from './news-types';
import { formatNewsDate } from './news-utils';

type NewsCardProps = {
  article: NewsArticleSummary;
  featured?: boolean;
};

export function NewsCard({ article, featured = false }: NewsCardProps) {
  const dateLabel = formatNewsDate(article.publicationDate);

  return (
    <article className={featured ? styles.cardFeatured : undefined}>
      <Link
        href={`/nyheder/${article.slug}`}
        className={styles.card}
        aria-label={`Læs: ${article.title}`}
      >
        <div className={styles.cardMedia}>
          {article.coverImageUrl ? (
            <img
              src={article.coverImageUrl}
              alt=""
              className={styles.cardImage}
              loading="lazy"
            />
          ) : (
            <div className={styles.cardPlaceholder} aria-hidden="true">
              <span>L&amp;Co.</span>
            </div>
          )}
          <span className={styles.cardCategory}>Nyhed</span>
        </div>

        <div className={styles.cardContent}>
          {dateLabel ? (
            <time dateTime={article.publicationDate ?? undefined} className={styles.cardDate}>
              {dateLabel}
            </time>
          ) : null}
          <h3 className={styles.cardTitle}>{article.title}</h3>
          <p className={styles.cardExcerpt}>{article.excerpt}</p>
          <span className={styles.cardReadMore} aria-hidden="true">
            Læs nyheden
          </span>
        </div>
      </Link>
    </article>
  );
}
