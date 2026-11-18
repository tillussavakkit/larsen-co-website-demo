import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { NewsArticle } from '@/app/nyheder/news-article';
import styles from '@/components/news.module.css';
import { requireCmsAdmin } from '@/lib/admin-auth';
import { getAdminArticle } from '@/lib/cms-repository';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Forhåndsvisning af artikel',
  robots: { index: false, follow: false, nocache: true },
};

type PreviewPageProps = {
  params: Promise<{ id: string }>;
};

function previewStatus(status: string, publicationDate: string | null) {
  if (status === 'draft') return 'Kladde';
  if (
    status === 'published' &&
    publicationDate &&
    new Date(publicationDate).getTime() > Date.now()
  ) {
    return 'Planlagt';
  }
  if (status === 'published') return 'Udgivet';
  return status;
}

export default async function ArticlePreviewPage({ params }: PreviewPageProps) {
  const { id } = await params;
  await requireCmsAdmin(`/admin/artikler/preview/${encodeURIComponent(id)}`);

  const article = await getAdminArticle(id);
  if (!article) notFound();

  return (
    <main id="main-content" className={styles.previewPage}>
      <div className={styles.previewHeaderOffset} aria-hidden="true" />
      <aside className={styles.previewBanner} aria-label="Forhåndsvisning">
        <div className={`shell ${styles.previewBannerInner}`}>
          <p>
            <strong>Forhåndsvisning</strong>
            <span>
              {previewStatus(article.status, article.publicationDate)} · Kun synlig for
              administratorer
            </span>
          </p>
          <Link href={`/admin/artikler/${article.id}`}>
            Tilbage til redigering
          </Link>
        </div>
      </aside>
      <NewsArticle article={article} preview />
    </main>
  );
}
