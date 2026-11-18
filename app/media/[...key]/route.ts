import { and, eq, like, lte, or } from 'drizzle-orm/sql/expressions/conditions';
import { getDb, getMediaBucket } from '@/db';
import { articles, mediaAssets } from '@/db/schema';
import { getCmsAdmin } from '@/lib/admin-auth';
import { mediaUrl } from '@/lib/cms-repository';

export const dynamic = 'force-dynamic';

type RouteContext = { params: Promise<{ key: string[] }> };

export async function GET(_request: Request, context: RouteContext) {
  const { key: parts } = await context.params;
  const objectKey = parts.join('/');
  if (!objectKey.startsWith('cms/') || parts.some((part) => part === '..')) {
    return new Response('Ikke fundet', { status: 404 });
  }

  try {
    const media = await getDb().query.mediaAssets.findFirst({
      where: eq(mediaAssets.objectKey, objectKey),
    });
    if (!media) return new Response('Ikke fundet', { status: 404 });

    const url = mediaUrl(objectKey);
    const visible = await getDb()
      .select({ id: articles.id })
      .from(articles)
      .where(
        and(
          eq(articles.status, 'published'),
          lte(articles.publicationDate, new Date().toISOString()),
          or(
            eq(articles.coverImageId, media.id),
            like(articles.contentHtml, `%${url}%`),
          ),
        ),
      )
      .limit(1);
    const publiclyVisible = visible.length > 0;
    if (!publiclyVisible && !(await getCmsAdmin())) {
      return new Response('Ikke fundet', { status: 404 });
    }

    const object = await getMediaBucket().get(objectKey);
    if (!object) return new Response('Ikke fundet', { status: 404 });

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    // Every request re-checks publication status so unpublishing immediately
    // revokes anonymous access to an article's previously public media.
    headers.set('cache-control', 'private, no-store');
    headers.set('vary', 'Cookie');
    headers.set('x-content-type-options', 'nosniff');
    return new Response(object.body, { headers });
  } catch {
    return new Response('Mediet kunne ikke hentes', { status: 500 });
  }
}
