import { eq, like, or } from 'drizzle-orm/sql/expressions/conditions';
import { getDb, getMediaBucket } from '@/db';
import { articles, mediaAssets } from '@/db/schema';
import { authorizeAdminApi } from '@/lib/admin-auth';
import { mediaUrl, recordAudit } from '@/lib/cms-repository';
import { sameOriginError } from '@/lib/request-security';

export const dynamic = 'force-dynamic';

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await authorizeAdminApi();
  if (!auth.ok) return auth.response;
  const originError = sameOriginError(_request);
  if (originError) return originError;
  const { id } = await context.params;

  try {
    const media = await getDb().query.mediaAssets.findFirst({
      where: eq(mediaAssets.id, id),
    });
    if (!media) return Response.json({ error: 'Billedet blev ikke fundet.' }, { status: 404 });

    const url = mediaUrl(media.objectKey);
    const usedBy = await getDb()
      .select({ id: articles.id })
      .from(articles)
      .where(
        or(
          eq(articles.coverImageId, id),
          like(articles.contentHtml, `%${url.replaceAll('%', '\\%').replaceAll('_', '\\_')}%`),
        ),
      )
      .limit(1);
    if (usedBy.length) {
      return Response.json(
        { error: 'Billedet bruges i en artikel og kan ikke slettes endnu.' },
        { status: 409 },
      );
    }

    await getDb().delete(mediaAssets).where(eq(mediaAssets.id, id));
    await recordAudit(auth.user, 'media.deleted', 'media', id, {
      filename: media.filename,
    });
    try {
      await getMediaBucket().delete(media.objectKey);
    } catch (storageError) {
      // The database is authoritative. A private orphaned object is safer than
      // metadata that points at an object which has already been removed.
      console.error('CMS media object cleanup failed', storageError);
    }
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: 'Billedet kunne ikke slettes.' }, { status: 500 });
  }
}
