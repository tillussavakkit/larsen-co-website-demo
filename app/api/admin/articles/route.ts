import { getDb } from '@/db';
import { articles } from '@/db/schema';
import { authorizeAdminApi } from '@/lib/admin-auth';
import { validateArticleInput } from '@/lib/article-validation';
import {
  articleWriteError,
  findSlugConflict,
  readArticleJson,
  resolveArticleCover,
} from '@/lib/article-route-utils';
import { listAdminArticles, recordAudit } from '@/lib/cms-repository';
import { sameOriginError } from '@/lib/request-security';

export const dynamic = 'force-dynamic';

export async function GET() {
  const auth = await authorizeAdminApi();
  if (!auth.ok) return auth.response;

  try {
    return Response.json({ articles: await listAdminArticles() });
  } catch {
    return Response.json({ error: 'Artiklerne kunne ikke hentes.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await authorizeAdminApi();
  if (!auth.ok) return auth.response;
  const originError = sameOriginError(request);
  if (originError) return originError;

  const payload = await readArticleJson(request);
  if (!payload.ok) return payload.response;
  const validation = validateArticleInput(payload.value);
  if (!validation.success) {
    return Response.json({ error: validation.error }, { status: 400 });
  }

  const cover = await resolveArticleCover(validation.data);
  if (!cover.ok) return cover.response;

  const now = new Date().toISOString();
  const id = crypto.randomUUID();

  try {
    if (await findSlugConflict(cover.data.slug)) {
      return Response.json(
        { error: 'URL-sluggen bruges allerede af en anden artikel.' },
        { status: 409 },
      );
    }

    const [article] = await getDb()
      .insert(articles)
      .values({
        id,
        ...cover.data,
        version: 1,
        createdBy: auth.user.userId,
        updatedBy: auth.user.userId,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    await recordAudit(auth.user, 'article.created', 'article', id, {
      status: article.status,
    });
    return Response.json({ article }, { status: 201 });
  } catch (error) {
    return articleWriteError(error);
  }
}
