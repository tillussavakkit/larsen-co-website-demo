import { and, eq } from 'drizzle-orm/sql/expressions/conditions';
import { getDb } from '@/db';
import { articleSlugHistory, articles } from '@/db/schema';
import { authorizeAdminApi } from '@/lib/admin-auth';
import { validateArticleInput } from '@/lib/article-validation';
import {
  articleWriteError,
  findSlugConflict,
  readArticleJson,
  resolveArticleCover,
} from '@/lib/article-route-utils';
import { getAdminArticle, recordAudit } from '@/lib/cms-repository';
import { sameOriginError } from '@/lib/request-security';

export const dynamic = 'force-dynamic';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const auth = await authorizeAdminApi();
  if (!auth.ok) return auth.response;
  const { id } = await context.params;

  try {
    const article = await getAdminArticle(id);
    if (!article) return Response.json({ error: 'Artiklen blev ikke fundet.' }, { status: 404 });
    return Response.json({ article });
  } catch {
    return Response.json({ error: 'Artiklen kunne ikke hentes.' }, { status: 500 });
  }
}

export async function PUT(request: Request, context: RouteContext) {
  const auth = await authorizeAdminApi();
  if (!auth.ok) return auth.response;
  const originError = sameOriginError(request);
  if (originError) return originError;
  const { id } = await context.params;
  const payload = await readArticleJson(request);
  if (!payload.ok) return payload.response;
  const validation = validateArticleInput(payload.value);
  if (!validation.success) {
    return Response.json({ error: validation.error }, { status: 400 });
  }

  const cover = await resolveArticleCover(validation.data);
  if (!cover.ok) return cover.response;

  try {
    const current = await getAdminArticle(id);
    if (!current) return Response.json({ error: 'Artiklen blev ikke fundet.' }, { status: 404 });
    if (validation.data.version !== current.version) {
      return Response.json(
        { error: 'Artiklen er ændret i en anden session. Genindlæs før du gemmer.' },
        { status: 409 },
      );
    }

    if (await findSlugConflict(cover.data.slug, id)) {
      return Response.json(
        { error: 'URL-sluggen bruges allerede af en anden artikel.' },
        { status: 409 },
      );
    }

    const [article] = await getDb()
      .update(articles)
      .set({
        ...cover.data,
        version: current.version + 1,
        updatedBy: auth.user.userId,
        updatedAt: new Date().toISOString(),
      })
      .where(and(eq(articles.id, id), eq(articles.version, current.version)))
      .returning();

    if (!article) {
      return Response.json(
        { error: 'Artiklen blev ændret, før den kunne gemmes. Genindlæs siden.' },
        { status: 409 },
      );
    }

    if (current.slug !== article.slug) {
      try {
        await getDb()
          .delete(articleSlugHistory)
          .where(
            and(
              eq(articleSlugHistory.slug, article.slug),
              eq(articleSlugHistory.articleId, article.id),
            ),
          );
        await getDb()
          .insert(articleSlugHistory)
          .values({ slug: current.slug, articleId: article.id })
          .onConflictDoUpdate({
            target: articleSlugHistory.slug,
            set: {
              articleId: article.id,
              createdAt: new Date().toISOString(),
            },
          });
      } catch (historyError) {
        console.error('CMS slug history update failed', historyError);
      }
    }

    await recordAudit(auth.user, 'article.updated', 'article', id, {
      fromStatus: current.status,
      toStatus: article.status,
      version: article.version,
    });
    return Response.json({ article });
  } catch (error) {
    return articleWriteError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await authorizeAdminApi();
  if (!auth.ok) return auth.response;
  const originError = sameOriginError(_request);
  if (originError) return originError;
  const { id } = await context.params;

  try {
    const current = await getAdminArticle(id);
    if (!current) return Response.json({ error: 'Artiklen blev ikke fundet.' }, { status: 404 });
    await getDb().delete(articles).where(eq(articles.id, id));
    await recordAudit(auth.user, 'article.deleted', 'article', id, {
      title: current.title,
      status: current.status,
    });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: 'Artiklen kunne ikke slettes.' }, { status: 500 });
  }
}
