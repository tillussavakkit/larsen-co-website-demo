/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import styles from '@/components/news.module.css';
import { sanitizeRichText } from '@/lib/rich-text';
import type { NewsArticleContent } from './news-types';
import { formatNewsDate } from './news-utils';

type NewsArticleProps = {
  article: NewsArticleContent;
  preview?: boolean;
};

export function NewsArticle({ article, preview = false }: NewsArticleProps) {
  const dateLabel = formatNewsDate(article.publicationDate);
  const safeContent = sanitizeRichText(article.contentHtml);

  return (
    <article>
      <header
        className={`${styles.articleHero}${preview ? ` ${styles.articleHeroPreview}` : ''}`}
      >
        <div className={`shell ${styles.articleHeroInner}`}>
          <div className={styles.articleHeroCopy}>
            <Link href="/nyheder" className={styles.backLink}>
              Alle nyheder
            </Link>
            <p className={styles.kicker}>Nyheder · Larsen &amp; Co.</p>
            <h1>{article.title}</h1>
            <p className={styles.articleLead}>{article.excerpt}</p>
            {dateLabel || article.author ? (
              <p className={styles.articleMeta}>
                {dateLabel ? (
                  <time dateTime={article.publicationDate ?? undefined}>{dateLabel}</time>
                ) : null}
                {dateLabel && article.author ? <span aria-hidden="true">·</span> : null}
                {article.author ? <span>Af {article.author}</span> : null}
              </p>
            ) : null}
          </div>

          <div className={styles.articleHeroMedia}>
            {article.coverImageUrl ? (
              <img src={article.coverImageUrl} alt="" className={styles.articleHeroImage} />
            ) : (
              <div className={styles.articleHeroPlaceholder} aria-hidden="true">
                <span>Nyheder</span>
                <strong>L&amp;Co.</strong>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className={`shell ${styles.articleLayout}`}>
        <aside className={styles.articleRail} aria-label="Artikeloplysninger">
          <span>Nyhed</span>
          {dateLabel ? (
            <time dateTime={article.publicationDate ?? undefined}>{dateLabel}</time>
          ) : null}
        </aside>

        <div className={styles.articleMain}>
          <div
            className={styles.articleProse}
            dangerouslySetInnerHTML={{ __html: safeContent }}
          />

          <footer className={styles.articleFooter}>
            {article.author ? (
              <p>
                <span>Skrevet af</span>
                <strong>{article.author}</strong>
              </p>
            ) : (
              <p>
                <span>Fra</span>
                <strong>Larsen &amp; Co.</strong>
              </p>
            )}
            <Link href="/nyheder" className={styles.articleFooterLink}>
              Se alle nyheder
            </Link>
          </footer>
        </div>
      </div>
    </article>
  );
}
