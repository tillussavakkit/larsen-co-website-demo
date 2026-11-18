import { and, eq, gt, lte } from 'drizzle-orm/sql/expressions/conditions';
import { asc, desc } from 'drizzle-orm/sql/expressions/select';
import { count } from 'drizzle-orm/sql/functions/aggregate';
import { getDb } from '@/db';
import {
  articleSlugHistory,
  articles,
  auditLog,
  mediaAssets,
  siteContent,
} from '@/db/schema';
import type { CmsUser } from '@/lib/cms-user';

export async function listAdminArticles() {
  return getDb().select().from(articles).orderBy(desc(articles.updatedAt));
}

export async function getAdminArticle(id: string) {
  return getDb().query.articles.findFirst({ where: eq(articles.id, id) });
}

export async function listPublishedArticles(limit = 24) {
  const now = new Date().toISOString();
  try {
    return await getDb()
      .select()
      .from(articles)
      .where(
        and(
          eq(articles.status, 'published'),
          lte(articles.publicationDate, now),
        ),
      )
      .orderBy(desc(articles.publicationDate))
      .limit(limit);
  } catch {
    return [];
  }
}

export async function getPublishedArticle(slug: string) {
  const now = new Date().toISOString();
  try {
    return (
      (await getDb().query.articles.findFirst({
        where: and(
          eq(articles.slug, slug),
          eq(articles.status, 'published'),
          lte(articles.publicationDate, now),
        ),
      })) ?? null
    );
  } catch {
    return null;
  }
}

export async function getSlugRedirect(slug: string) {
  try {
    const history = await getDb().query.articleSlugHistory.findFirst({
      where: eq(articleSlugHistory.slug, slug),
    });
    if (!history) return null;
    const article = await getPublishedArticleById(history.articleId);
    return article?.slug ?? null;
  } catch {
    return null;
  }
}

export async function getPublishedArticleById(id: string) {
  const now = new Date().toISOString();
  return (
    (await getDb().query.articles.findFirst({
      where: and(
        eq(articles.id, id),
        eq(articles.status, 'published'),
        lte(articles.publicationDate, now),
      ),
    })) ?? null
  );
}

export async function listMedia() {
  const rows = await getDb()
    .select()
    .from(mediaAssets)
    .orderBy(desc(mediaAssets.createdAt));
  return rows.map((row) => ({ ...row, url: mediaUrl(row.objectKey) }));
}

export function mediaUrl(objectKey: string) {
  return `/media/${objectKey
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/')}`;
}

export async function getAdminOverview() {
  const db = getDb();
  const now = new Date().toISOString();
  const [publishedRows, draftRows, scheduledRows, contentRows, mediaRows, recent] =
    await Promise.all([
      db
        .select({ value: count() })
        .from(articles)
        .where(
          and(
            eq(articles.status, 'published'),
            lte(articles.publicationDate, now),
          ),
        ),
      db.select({ value: count() }).from(articles).where(eq(articles.status, 'draft')),
      db
        .select({ value: count() })
        .from(articles)
        .where(
          and(
            eq(articles.status, 'published'),
            gt(articles.publicationDate, now),
          ),
        ),
      db.select({ value: count() }).from(siteContent),
      db.select({ value: count() }).from(mediaAssets),
      db.select().from(articles).orderBy(desc(articles.updatedAt)).limit(6),
    ]);

  return {
    generatedAt: now,
    counts: {
      published: publishedRows[0]?.value ?? 0,
      drafts: draftRows[0]?.value ?? 0,
      scheduled: scheduledRows[0]?.value ?? 0,
      content: contentRows[0]?.value ?? 0,
      media: mediaRows[0]?.value ?? 0,
    },
    recentArticles: recent,
  };
}

export async function recordAudit(
  user: CmsUser,
  action: string,
  entityType: string,
  entityId: string,
  metadata: Record<string, unknown> = {},
) {
  try {
    await getDb().insert(auditLog).values({
      userId: user.userId,
      userEmail: user.email,
      action,
      entityType,
      entityId,
      metadata: JSON.stringify(metadata),
    });
  } catch (error) {
    // Audit logging must never turn an already successful content mutation into
    // a failed response that administrators may retry. Keep the mutation result
    // authoritative and surface the failure in worker logs.
    console.error('CMS audit log write failed', error);
  }
}

export async function listContentRows() {
  return getDb().select().from(siteContent).orderBy(asc(siteContent.pageKey), asc(siteContent.key));
}
