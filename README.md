# Larsen & Co. website and CMS

Production-oriented, Danish-language website and content management system for Larsen & Co. in Nuuk. The project was prepared for BB Digital ApS using confirmed business information and the supplied Larsen & Co. photography.

## Technology

- Next.js App Router APIs, React Server Components, TypeScript, Vinext, and Vite
- OpenAI Sites hosting with a Cloudflare D1 database (`DB`) and R2 media bucket (`BUCKET`)
- Drizzle ORM and versioned SQL migrations under `drizzle/`
- Dispatch-owned Sites/ChatGPT identity plus a server-side administrator email allowlist
- Server-side HTML sanitization for article content
- Server-side Resend email delivery through `app/api/contact/route.ts`
- Responsive custom Larsen & Co. design without a large UI framework

Supabase is not required for this deployment. The project already runs on Sites, so its native identity, D1, and R2 services provide authentication and persistent storage without adding a second backend.

## Run locally

Requirements: Node.js 22.13 or newer and npm.

```bash
npm install
cp .env.example .env.local
npm run build
node ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_third_forge.sql
npm run dev
```

The D1 command is needed once for the initial local database. Do not replay a migration that has already been applied. When later migrations exist, apply each pending file in filename order and keep `--persist-to .wrangler/state` exactly as shown.

Portable loopback development provides a local-only Sites sign-in simulator. Add `seedy@sites.test` to `CMS_ADMIN_EMAILS`, start the app, then open `/signin-with-chatgpt?return_to=/admin`. This mock identity is not included in production builds.

Useful checks:

```bash
npm run lint
npm run typecheck
npm run build
```

After changing `db/schema.ts`, generate and inspect a new migration before building:

```bash
npm run db:generate
```

## Environment variables

Copy `.env.example` to `.env.local` for local work. Configure the same values in the hosted Sites environment as appropriate.

| Variable | Visibility | Purpose |
| --- | --- | --- |
| `CMS_ADMIN_EMAILS` | Secret | Comma-separated email addresses allowed to use `/admin`; there is no public registration |
| `RESEND_API_KEY` | Secret | Server-side Resend API key |
| `RESEND_FROM_EMAIL` | Secret | Sender on a domain verified in Resend |
| `LARSEN_CONTACT_EMAIL` | Secret | Larsen & Co. contact-form destination |
| `NEXT_PUBLIC_SITE_URL` | Public | Optional trusted origin for canonical metadata, sitemap, and robots output |

Email comparison for `CMS_ADMIN_EMAILS` is case-insensitive. Keep the list narrow, remove departed users promptly, and never place service credentials in client code. An empty or missing allowlist fails closed: nobody can administer the site.

Missing Resend values do not break public pages; the contact endpoint returns a controlled unavailable response until mail is configured.

## Client administration

The Danish admin interface lives at `/admin` and supports desktop, tablet, and mobile layouts.

1. Sign in with an email address already present in `CMS_ADMIN_EMAILS`.
2. Use **Overblik** for article, draft, page, and media counts.
3. Use **Artikler** to create, edit, preview, publish, unpublish, schedule, or delete news.
4. Use **Sider** to edit only the approved text fields grouped by public page.
5. Use **Medier** to upload, inspect, select, and remove images.
6. Use **Log ud** when finished, especially on a shared device.

See [CMS operations](docs/cms-operations.md) for the client workflow, access model, and BB Digital maintenance checklist.

## Routes

Public:

- `/` — homepage with latest published news when available
- `/om-os` — company and owners
- `/kompetencer` — confirmed competency areas
- `/projekter` — accessible visual gallery and lightbox
- `/nyheder` — published news archive
- `/nyheder/[slug]` — individual published article with canonical metadata
- `/kontakt` — contact details and Resend-backed form
- `/media/[...key]` — controlled delivery of CMS media
- branded 404, sitemap, and robots metadata

Administration:

- `/admin` — protected overview
- `/admin/artikler` — article list
- `/admin/artikler/ny` and `/admin/artikler/[id]` — editor
- `/admin/artikler/preview/[id]` — protected, no-index preview
- `/admin/sider` — fixed-page text editor
- `/admin/medier` — media library

## Content and storage architecture

`lib/content-definitions.ts` is the allowlist of text fields that clients may edit. It keeps navigation behavior, layout, code, and design settings outside the CMS. Public pages merge stored values from D1 with verified source defaults, so an empty database does not erase the existing website copy.

D1 tables cover articles, historical slugs, page text, media metadata, and the audit log. R2 stores uploaded image bytes. Article bodies are sanitized on write and again on render. Public queries return only articles whose status is `published` and whose publication time has arrived; drafts and future-dated articles are excluded from public pages, metadata, redirects, and media authorization.

Structured items that require developer review—such as navigation, owner records, the project gallery catalog, design assets, and application logic—remain source-controlled. This is deliberate and prevents administrators from editing code or breaking layout behavior.

## Assets

Source-controlled production assets are organized under:

```text
public/images/larsen-co/
├── logos/
├── owners/
└── work/
```

The supplied photo PNGs were converted to high-quality JPEG copies for smaller browser transfers. Logo files remain PNG so the authentic artwork is preserved. The site never reads from the original ZIP at runtime.

`public/og.png` is the branded 1200 × 630 social-sharing image. Its generation brief is recorded in `docs/og-image-prompt.md`.

CMS uploads live in R2 and are not part of the Git repository or a source ZIP. Preserve both D1 data and R2 objects when moving, cloning, or retiring the deployment.

## Resend setup

1. Verify the sender domain in Resend.
2. Create a sending API key with the narrowest appropriate permissions.
3. Configure the three Resend variables in local development and Sites.
4. Submit a controlled enquiry and confirm delivery and reply behavior.

The server route validates and limits input, silently handles the honeypot, applies best-effort rate limiting, escapes user content used in HTML, sends a plain-text fallback, and sets the visitor address as `reply_to`. Automatic visitor confirmation is intentionally not enabled.

## Deployment and migrations

`.openai/hosting.json` declares the existing Sites project plus the `DB` and `BUCKET` bindings. Sites provisions and connects those hosted resources.

For every schema change:

1. Update `db/schema.ts`.
2. Run `npm run db:generate`.
3. Review and commit the generated SQL, snapshot, and journal change.
4. Apply the pending migration to the separate local preview database.
5. Run lint, type checking, and a production build.
6. Publish through the Sites source workflow. Sites applies pending hosted migrations before uploading the Worker.

Never modify or delete an already-applied migration. Append a new migration instead. A failed deployment may still have applied its database migration, so verify migration state before attempting a repair.

Before production launch, BB Digital should also:

- configure `CMS_ADMIN_EMAILS` and the Resend secrets;
- retain the intended Sites audience/access policy;
- set the final trusted site origin if the public URL changes;
- test sign-in, draft visibility, scheduled publication, CRUD, media upload/delete, page-text editing, logout, and the contact form;
- confirm that the initial administrator can sign in before handing access to Larsen & Co.

## Maintenance and recovery

- Keep schema, migrations, dependencies, and the administrator allowlist under BB Digital change control.
- Export or otherwise back up D1 content and R2 media before destructive maintenance, major schema changes, or moving the Site. Source control alone is not a CMS-data backup.
- Treat unused R2 objects and stale administrator access as maintenance items.
- Periodically test a draft article, a scheduled article, a published article, and an image referenced from a published article.
- Review dependency advisories and upgrade through a tested build rather than applying force updates blindly.
- Preserve the audit table when exporting or migrating content; it records administrator write activity.

## Information still requiring Larsen & Co. confirmation

- business email address
- physical address
- owner titles beyond “Ejer”
- complete service list
- exact project names and details
- final professional owner portraits
- any additional verified company copy

These items are intentionally omitted or represented by neutral content. No customer names, testimonials, certifications, project facts, company history, or other unverified business claims were invented.
