import { eq } from 'drizzle-orm/sql/expressions/conditions';
import { getDb } from '@/db';
import { articleSlugHistory, articles, mediaAssets } from '@/db/schema';
import type { ValidArticleInput } from '@/lib/article-validation';
import { mediaUrl } from '@/lib/cms-repository';
import { readJsonWithLimit } from '@/lib/request-security';

const MAX_ARTICLE_JSON_BYTES = 150_000;

export function readArticleJson(request: Request) {
  return readJsonWithLimit(
    request,
    MAX_ARTICLE_JSON_BYTES,
    'Ugyldige artikeldata.',
    'Artiklen er for stor.',
  );
}

export async function resolveArticleCover(input: ValidArticleInput) {
  if (input.coverImageId) {
    const media = await getDb().query.mediaAssets.findFirst({
      where: eq(mediaAssets.id, input.coverImageId),
    });
    if (!media) {
      return {
        ok: false as const,
        response: Response.json(
          { error: 'Det valgte forsidebillede findes ikke længere.' },
          { status: 400 },
        ),
      };
    }

    return {
      ok: true as const,
      data: {
        ...input,
        coverImageId: media.id,
        coverImageUrl: mediaUrl(media.objectKey),
      },
    };
  }

  if (input.coverImageUrl.startsWith('/media/')) {
    return {
      ok: false as const,
      response: Response.json(
        { error: 'Vælg forsidebilledet fra mediebiblioteket igen.' },
        { status: 400 },
      ),
    };
  }

  return { ok: true as const, data: input };
}

export async function findSlugConflict(slug: string, articleId?: string) {
  const [active, historical] = await Promise.all([
    getDb().query.articles.findFirst({ where: eq(articles.slug, slug) }),
    getDb().query.articleSlugHistory.findFirst({
      where: eq(articleSlugHistory.slug, slug),
    }),
  ]);

  if (active && active.id !== articleId) return active.id;
  if (historical && historical.articleId !== articleId) return historical.articleId;
  return null;
}

export function articleWriteError(error: unknown) {
  const message = error instanceof Error ? error.message : '';
  if (
    message.includes('articles.slug') ||
    message.includes('article_slug_history.slug') ||
    message.includes('UNIQUE constraint')
  ) {
    return Response.json(
      { error: 'URL-sluggen bruges allerede af en anden artikel.' },
      { status: 409 },
    );
  }
  return Response.json({ error: 'Artiklen kunne ikke gemmes.' }, { status: 500 });
}
