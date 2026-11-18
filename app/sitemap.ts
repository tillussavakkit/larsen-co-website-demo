import type { MetadataRoute } from 'next';
import { listPublishedArticles } from '@/lib/cms-repository';
import { siteUrl } from '@/lib/site-url';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await listPublishedArticles(1_000);
  const pages: MetadataRoute.Sitemap = [
    '',
    '/om-os',
    '/kompetencer',
    '/projekter',
    '/nyheder',
    '/kontakt',
  ].map((path, index) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '/nyheder' ? 'weekly' : index === 0 ? 'monthly' : 'yearly',
    priority: index === 0 ? 1 : 0.8,
  }));

  return [
    ...pages,
    ...articles.map((article) => ({
      url: `${siteUrl}/nyheder/${article.slug}`,
      lastModified: new Date(article.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
