# Larsen & Co. CMS operations

This guide is the operating handoff for Larsen & Co. and BB Digital ApS. The client-facing interface is in Danish; technical configuration remains BB Digital’s responsibility.

## Access and administrator lifecycle

Open `/admin` and choose **Log ind som administrator**. Authentication is handled by the hosting platform. The application then checks the signed-in email against the server-side `CMS_ADMIN_EMAILS` allowlist.

There is no administrator registration page. Adding or removing an administrator is a BB Digital maintenance action:

1. Verify the person and the exact email address.
2. Update the comma-separated `CMS_ADMIN_EMAILS` secret in Sites.
3. Deploy or activate the updated environment as required by the host.
4. Test sign-in and logout with the affected account.
5. Remove access promptly when it is no longer required.

The hosting audience policy and the CMS allowlist are separate controls. Preserve the intended Sites audience, and always keep the application allowlist enabled.

## Publish an article

1. Choose **Artikler** and **Ny artikel**.
2. Enter the title. Confirm the generated URL key before publication.
3. Add the short description, cover image, article body, and optional author.
4. Use the simple toolbar for headings, paragraphs, bold, italic, lists, links, and inline images.
5. Complete the optional SEO title and description. If left empty, the public page uses the article title and excerpt.
6. Select **Kladde** to keep the article private, or **Udgivet** and choose a publication date and time.
7. Save the article, then use **Forhåndsvis** to inspect the protected preview.

A future publication time creates a planned article. It does not appear publicly until that time. Changing a published article back to **Kladde** removes it from the public archive and individual article route. If a published slug changes, the CMS retains the old slug for a permanent redirect.

Deleting an article requires confirmation and cannot be undone through the interface.

## Edit website text

Choose **Sider**. Fields are grouped by webpage and section. Edit the required values and select **Gem sider**.

Only fields explicitly approved in `lib/content-definitions.ts` appear. Administrators cannot change navigation logic, templates, application code, or design rules. BB Digital must add any new editable field to the definition list and connect it to the relevant page component.

The public site uses source-controlled fallback copy when a field has never been saved. A saved CMS value takes precedence immediately.

## Manage media

Choose **Medier** to upload or inspect images. Supported formats are JPG, PNG, WebP, and AVIF, with a maximum size of 8 MB. MIME type and file signatures are checked server-side.

Write useful alternative text for meaningful images. The article editor can select library images for covers and inline content. An image referenced by an article cannot be deleted until the reference is removed. Deletion requires confirmation.

R2 objects are private by default. The media delivery route exposes an object anonymously only when a currently published article references it. Administrators can view draft media after authentication.

## Publication and visibility rules

Public article queries require both:

- status `published`; and
- publication date/time less than or equal to the current server time.

The same rule protects the news archive, individual article pages, metadata, historical-slug redirects, sitemap entries, homepage news cards, and media access. Draft previews are protected and marked no-index.

Article HTML is sanitized on the server. Administrator APIs recheck identity and authorization for every read and write; client-side navigation is not treated as a security boundary.

## BB Digital deployment checklist

1. Confirm the source contains the intended `.openai/hosting.json` project ID and `DB`/`BUCKET` bindings.
2. Configure `CMS_ADMIN_EMAILS`, Resend secrets, and the optional public origin in Sites.
3. Generate and inspect migrations after any schema change.
4. Run `npm run lint`, `npm run typecheck`, and `npm run build`.
5. Publish through the Sites workflow. Hosted migrations are applied before the Worker upload.
6. Test unauthorized access, authorized sign-in/logout, article CRUD, draft and future-date privacy, media upload/removal, page-copy editing, and public rendering.
7. Keep the desired Site audience/access policy unchanged unless the client has approved a change.

## Data maintenance

The system stores structured content in D1 and media bytes in R2. Neither is reconstructed from Git.

Before destructive maintenance or a Site move:

- preserve a D1 export or equivalent content backup;
- preserve the corresponding R2 objects;
- keep migration files and Drizzle metadata with the source;
- record the administrator allowlist and non-secret deployment configuration separately from the backup;
- verify a restore in a controlled environment where practical.

Do not edit an applied migration. Append a migration for every later schema change. Avoid bulk deletion of R2 objects based only on filenames; media metadata and article references live in D1.

## Troubleshooting

**A valid user sees “Adgang afvist”**
Confirm the exact signed-in email is present in `CMS_ADMIN_EMAILS`, without quotes. Comparison is case-insensitive, and multiple addresses are comma-separated.

**An article is missing publicly**
Check that its status is **Udgivet**, its publication time has arrived, and its slug is unique. A future time is intentionally treated as planned.

**An image cannot be deleted**
Remove it from article covers and article bodies, save those articles, then retry deletion.

**The contact form is unavailable**
Verify `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `LARSEN_CONTACT_EMAIL`, then send a controlled test.

**Local CMS tables are missing**
Build once to create `dist/server/wrangler.json`, then apply each pending migration to the local D1 state using the command documented in the project README.
