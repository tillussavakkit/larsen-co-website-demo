export type ArticleStatus = 'draft' | 'published';

export type AdminArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImageId: string | null;
  coverImageUrl: string;
  contentHtml: string;
  author: string;
  publicationDate: string | null;
  status: ArticleStatus | string;
  seoTitle: string;
  seoDescription: string;
  version: number;
  createdAt?: string;
  updatedAt?: string;
};

export type MediaRecord = {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  altText: string;
  createdAt: string;
};

export type DashboardCounts = {
  articles?: number;
  published?: number;
  drafts?: number;
  pages?: number;
  media?: number;
};

export type RecentAdminItem = {
  id: string;
  title: string;
  type?: 'article' | 'page';
  status?: string;
  updatedAt?: string;
  href?: string;
};

export function articleStatusLabel(status: string) {
  switch (status) {
    case 'draft':
      return 'Kladde';
    case 'scheduled':
      return 'Planlagt';
    case 'published':
      return 'Udgivet';
    case 'archived':
      return 'Arkiveret';
    default:
      return status || 'Ukendt';
  }
}

export function formatAdminDate(value?: string | null, includeTime = false) {
  if (!value) return 'Ikke angivet';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('da-DK', {
    dateStyle: 'medium',
    ...(includeTime ? { timeStyle: 'short' as const } : {}),
  }).format(date);
}

export async function responseError(response: Response, fallback: string) {
  try {
    const data = (await response.json()) as { error?: string };
    return data.error || fallback;
  } catch {
    return fallback;
  }
}
