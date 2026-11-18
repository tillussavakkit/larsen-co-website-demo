import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import styles from '@/components/news.module.css';
import { getPublishedArticle, getSlugRedirect } from '@/lib/cms-repository';
import { siteUrl } from '@/lib/site-url';
import { NewsArticle } from '../news-article';
import { absoluteNewsImageUrl } from '../news-utils';

export const dynamic = 'force-dynamic';

type NewsDetailProps = {
  params: Promise<{ slug: string }>;
};

async function resolvePublishedArticle(slug: string) {
  const article = await getPublishedArticle(slug);
  if (article) return article;

  const currentSlug = await getSlugRedirect(slug);
  return currentSlug && currentSlug !== slug
    ? getPublishedArticle(currentSlug)
    : null;
}

export async function generateMetadata({ params }: NewsDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await resolvePublishedArticle(slug);

  if (!article) {
    return {
      title: 'Nyheden blev ikke fundet',
      robots: { index: false, follow: false },
    };
  }

  const title = article.seoTitle || article.title;
  const description = article.seoDescription || article.excerpt;
  const canonical = `${siteUrl}/nyheder/${article.slug}`;
  const image = article.coverImageUrl
    ? absoluteNewsImageUrl(article.coverImageUrl, siteUrl)
    : `${siteUrl}/og.png`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'article',
      locale: 'da_DK',
      siteName: 'Larsen & Co.',
      publishedTime: article.publicationDate ?? undefined,
      authors: article.author ? [article.author] : undefined,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default async function NewsDetailPage({ params }: NewsDetailProps) {
  const { slug } = await params;
  const article = await getPublishedArticle(slug);

  if (!article) {
    const currentSlug = await getSlugRedirect(slug);
    if (currentSlug && currentSlug !== slug) {
      permanentRedirect(`/nyheder/${currentSlug}`);
    }
    notFound();
  }

  return (
    <main id="main-content" className={styles.articlePage}>
      <NewsArticle article={article} />
    </main>
  );
}
