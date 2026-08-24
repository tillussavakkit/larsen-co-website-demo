import type { Metadata } from 'next';
import { siteUrl } from '@/lib/site-url';

type PageMetadataOptions = {
  title: string;
  description: string;
  path: `/${string}`;
};

export function createPageMetadata({
  title,
  description,
  path,
}: PageMetadataOptions): Metadata {
  const fullTitle = `${title} | Larsen & Co.`;
  const url = `${siteUrl}${path}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      type: 'website',
      locale: 'da_DK',
      siteName: 'Larsen & Co.',
      images: [
        {
          url: '/og.png',
          width: 1200,
          height: 630,
          alt: 'Larsen & Co. — mere end 45 års erfaring',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: ['/og.png'],
    },
  };
}
