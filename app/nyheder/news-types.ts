import type { ArticleRecord } from '@/lib/cms-types';

export type NewsArticleSummary = Pick<
  ArticleRecord,
  | 'id'
  | 'title'
  | 'slug'
  | 'excerpt'
  | 'coverImageUrl'
  | 'author'
  | 'publicationDate'
>;

export type NewsArticleContent = NewsArticleSummary &
  Pick<
    ArticleRecord,
    'contentHtml' | 'status' | 'seoTitle' | 'seoDescription'
  >;
