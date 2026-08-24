import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/site-url';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    '',
    '/om-os',
    '/kompetencer',
    '/projekter',
    '/kontakt',
  ].map((path, index) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: index === 0 ? 'monthly' : 'yearly',
    priority: index === 0 ? 1 : 0.8,
  }));
}
