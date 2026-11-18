import { sql } from 'drizzle-orm/sql';
import {
  check,
  index,
  integer,
  serial,
  text,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { cms } from './auth-schema';

const currentTimestamp = sql`to_char(
      timezone('UTC', now()),
      'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
    )`;

export const mediaAssets = cms.table(
  'media_assets',
  {
    id: text('id').primaryKey(),
    objectKey: text('object_key').notNull(),
    filename: text('filename').notNull(),
    mimeType: text('mime_type').notNull(),
    sizeBytes: integer('size_bytes').notNull(),
    altText: text('alt_text').notNull().default(''),
    uploadedBy: text('uploaded_by').notNull(),
    createdAt: text('created_at').notNull().default(currentTimestamp),
  },
  (table) => [
    uniqueIndex('media_assets_object_key_unique').on(table.objectKey),
    index('media_assets_created_at_idx').on(table.createdAt),
  ],
);

export const articles = cms.table(
  'articles',
  {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    slug: text('slug').notNull(),
    excerpt: text('excerpt').notNull().default(''),
    coverImageId: text('cover_image_id').references(() => mediaAssets.id, {
      onDelete: 'set null',
    }),
    coverImageUrl: text('cover_image_url').notNull().default(''),
    contentHtml: text('content_html').notNull().default('<p></p>'),
    author: text('author'),
    publicationDate: text('publication_date'),
    status: text('status', { enum: ['draft', 'published'] })
      .notNull()
      .default('draft'),
    seoTitle: text('seo_title').notNull().default(''),
    seoDescription: text('seo_description').notNull().default(''),
    createdBy: text('created_by').notNull(),
    updatedBy: text('updated_by').notNull(),
    createdAt: text('created_at').notNull().default(currentTimestamp),
    updatedAt: text('updated_at').notNull().default(currentTimestamp),
    version: integer('version').notNull().default(1),
  },
  (table) => [
    uniqueIndex('articles_slug_unique').on(table.slug),
    index('articles_publication_idx').on(table.status, table.publicationDate),
    index('articles_updated_at_idx').on(table.updatedAt),
    check('articles_status_check', sql`${table.status} in ('draft', 'published')`),
  ],
);

export const articleSlugHistory = cms.table(
  'article_slug_history',
  {
    slug: text('slug').primaryKey(),
    articleId: text('article_id')
      .notNull()
      .references(() => articles.id, { onDelete: 'cascade' }),
    createdAt: text('created_at').notNull().default(currentTimestamp),
  },
  (table) => [index('article_slug_history_article_idx').on(table.articleId)],
);

export const siteContent = cms.table(
  'site_content',
  {
    key: text('key').primaryKey(),
    pageKey: text('page_key').notNull(),
    value: text('value').notNull().default(''),
    updatedBy: text('updated_by').notNull(),
    updatedAt: text('updated_at').notNull().default(currentTimestamp),
  },
  (table) => [index('site_content_page_idx').on(table.pageKey)],
);

export const auditLog = cms.table(
  'audit_log',
  {
    id: serial('id').primaryKey(),
    userId: text('user_id').notNull(),
    userEmail: text('user_email').notNull(),
    action: text('action').notNull(),
    entityType: text('entity_type').notNull(),
    entityId: text('entity_id').notNull(),
    metadata: text('metadata').notNull().default('{}'),
    createdAt: text('created_at').notNull().default(currentTimestamp),
  },
  (table) => [index('audit_log_created_at_idx').on(table.createdAt)],
);

export * from './auth-schema';
