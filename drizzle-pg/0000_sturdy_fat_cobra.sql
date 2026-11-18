CREATE SCHEMA "larsen_cms";
--> statement-breakpoint
CREATE TABLE "larsen_cms"."article_slug_history" (
	"slug" text PRIMARY KEY NOT NULL,
	"article_id" text NOT NULL,
	"created_at" text DEFAULT to_char(
      timezone('UTC', now()),
      'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
    ) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "larsen_cms"."articles" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"excerpt" text DEFAULT '' NOT NULL,
	"cover_image_id" text,
	"cover_image_url" text DEFAULT '' NOT NULL,
	"content_html" text DEFAULT '<p></p>' NOT NULL,
	"author" text,
	"publication_date" text,
	"status" text DEFAULT 'draft' NOT NULL,
	"seo_title" text DEFAULT '' NOT NULL,
	"seo_description" text DEFAULT '' NOT NULL,
	"created_by" text NOT NULL,
	"updated_by" text NOT NULL,
	"created_at" text DEFAULT to_char(
      timezone('UTC', now()),
      'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
    ) NOT NULL,
	"updated_at" text DEFAULT to_char(
      timezone('UTC', now()),
      'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
    ) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "articles_status_check" CHECK ("larsen_cms"."articles"."status" in ('draft', 'published'))
);
--> statement-breakpoint
CREATE TABLE "larsen_cms"."audit_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"user_email" text NOT NULL,
	"action" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL,
	"metadata" text DEFAULT '{}' NOT NULL,
	"created_at" text DEFAULT to_char(
      timezone('UTC', now()),
      'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
    ) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "larsen_cms"."media_assets" (
	"id" text PRIMARY KEY NOT NULL,
	"object_key" text NOT NULL,
	"filename" text NOT NULL,
	"mime_type" text NOT NULL,
	"size_bytes" integer NOT NULL,
	"alt_text" text DEFAULT '' NOT NULL,
	"uploaded_by" text NOT NULL,
	"created_at" text DEFAULT to_char(
      timezone('UTC', now()),
      'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
    ) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "larsen_cms"."site_content" (
	"key" text PRIMARY KEY NOT NULL,
	"page_key" text NOT NULL,
	"value" text DEFAULT '' NOT NULL,
	"updated_by" text NOT NULL,
	"updated_at" text DEFAULT to_char(
      timezone('UTC', now()),
      'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
    ) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "larsen_cms"."account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp with time zone,
	"refresh_token_expires_at" timestamp with time zone,
	"scope" text,
	"password" text,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "larsen_cms"."session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"impersonated_by" text,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "larsen_cms"."user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"role" text DEFAULT 'user',
	"banned" boolean DEFAULT false,
	"ban_reason" text,
	"ban_expires" timestamp with time zone,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "larsen_cms"."verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "larsen_cms"."article_slug_history" ADD CONSTRAINT "article_slug_history_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "larsen_cms"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "larsen_cms"."articles" ADD CONSTRAINT "articles_cover_image_id_media_assets_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "larsen_cms"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "larsen_cms"."account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "larsen_cms"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "larsen_cms"."session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "larsen_cms"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "article_slug_history_article_idx" ON "larsen_cms"."article_slug_history" USING btree ("article_id");--> statement-breakpoint
CREATE UNIQUE INDEX "articles_slug_unique" ON "larsen_cms"."articles" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "articles_publication_idx" ON "larsen_cms"."articles" USING btree ("status","publication_date");--> statement-breakpoint
CREATE INDEX "articles_updated_at_idx" ON "larsen_cms"."articles" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "audit_log_created_at_idx" ON "larsen_cms"."audit_log" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "media_assets_object_key_unique" ON "larsen_cms"."media_assets" USING btree ("object_key");--> statement-breakpoint
CREATE INDEX "media_assets_created_at_idx" ON "larsen_cms"."media_assets" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "site_content_page_idx" ON "larsen_cms"."site_content" USING btree ("page_key");--> statement-breakpoint
CREATE INDEX "account_user_id_idx" ON "larsen_cms"."account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_user_id_idx" ON "larsen_cms"."session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "larsen_cms"."verification" USING btree ("identifier");