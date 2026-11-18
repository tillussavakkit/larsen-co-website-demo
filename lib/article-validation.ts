import type { ArticleStatus } from '@/lib/cms-types';
import { richTextPlainText, sanitizeRichText } from '@/lib/rich-text';

export type ValidArticleInput = {
  title: string;
  slug: string;
  excerpt: string;
  coverImageId: string | null;
  coverImageUrl: string;
  contentHtml: string;
  author: string | null;
  publicationDate: string | null;
  status: ArticleStatus;
  seoTitle: string;
  seoDescription: string;
  version?: number;
};

export function validateArticleInput(payload: unknown):
  | { success: true; data: ValidArticleInput }
  | { success: false; error: string } {
  if (!payload || typeof payload !== 'object') return fail('Ugyldige artikeldata.');
  const value = payload as Record<string, unknown>;

  const title = text(value.title, 160);
  const slug = normalizeSlug(text(value.slug, 120) || title);
  const excerpt = text(value.excerpt, 400);
  const contentHtml = sanitizeRichText(text(value.contentHtml, 100_000, false));
  const author = nullableText(value.author, 120);
  const seoTitle = text(value.seoTitle, 70);
  const seoDescription = text(value.seoDescription, 180);
  const coverImageId = nullableText(value.coverImageId, 80);
  const coverImageUrl = text(value.coverImageUrl, 2_048);
  const status = value.status === 'published' ? 'published' : 'draft';
  const publicationDate = normalizeDate(value.publicationDate);
  const version = Number.isInteger(value.version) ? Number(value.version) : undefined;

  if (title.length < 3) return fail('Titlen skal være mindst 3 tegn.');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return fail('URL-sluggen må kun indeholde små bogstaver, tal og bindestreger.');
  }
  if (status === 'published' && excerpt.length < 10) {
    return fail('En udgivet artikel skal have en kort beskrivelse på mindst 10 tegn.');
  }
  if (status === 'published' && richTextPlainText(contentHtml).length < 10) {
    return fail('En udgivet artikel skal have en artikeltekst på mindst 10 tegn.');
  }
  if (coverImageUrl && !isSafePublicUrl(coverImageUrl)) {
    return fail('Forsidebilledets URL er ikke gyldig.');
  }
  if (status === 'published' && !publicationDate) {
    return fail('En udgivet artikel skal have en udgivelsesdato.');
  }

  return {
    success: true,
    data: {
      title,
      slug,
      excerpt,
      coverImageId,
      coverImageUrl,
      contentHtml,
      author,
      publicationDate,
      status,
      seoTitle,
      seoDescription,
      version,
    },
  };
}

export function normalizeSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/æ/g, 'ae')
    .replace(/ø/g, 'oe')
    .replace(/å/g, 'aa')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}

function text(value: unknown, maxLength: number, trim = true) {
  const output = typeof value === 'string' ? value.slice(0, maxLength) : '';
  return trim ? output.trim() : output;
}

function nullableText(value: unknown, maxLength: number) {
  const output = text(value, maxLength);
  return output || null;
}

function normalizeDate(value: unknown) {
  if (typeof value !== 'string' || !value.trim()) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function isSafePublicUrl(value: string) {
  if (value.startsWith('/media/')) return true;
  try {
    const url = new URL(value);
    return url.protocol === 'https:';
  } catch {
    return false;
  }
}

function fail(error: string) {
  return { success: false as const, error };
}
