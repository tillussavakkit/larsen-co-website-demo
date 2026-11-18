export type ArticleStatus = 'draft' | 'published';

export type ArticleRecord = {
  id: string;
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
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  version: number;
};

export type MediaRecord = {
  id: string;
  objectKey: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  altText: string;
  uploadedBy: string;
  createdAt: string;
  url: string;
};

export type ContentFieldType = 'text' | 'textarea' | 'tel' | 'number';

export type ContentFieldDefinition = {
  key: string;
  page: string;
  pageLabel: string;
  section: string;
  label: string;
  type: ContentFieldType;
  defaultValue: string;
  help?: string;
  maxLength?: number;
};
