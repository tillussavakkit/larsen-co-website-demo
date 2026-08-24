# Larsen & Co. website demo

Premium, Danish-language website demo for Larsen & Co., a contractor and blasting specialist in Nuuk, Greenland. The project was prepared for BB Digital using only confirmed business information and the supplied Larsen & Co. photography.

## Technology

- Next.js App Router APIs with TypeScript and React Server Components
- Vinext/Vite build for Cloudflare-compatible OpenAI Sites hosting
- Tailwind CSS build pipeline plus a custom Larsen & Co. visual system
- `next/image` for responsive image delivery and lazy loading
- Server-side Resend email delivery through `app/api/contact/route.ts`
- No database, authentication, CMS, or large UI library

## Run locally

Requirements: Node.js 22.13 or newer and npm.

```bash
npm install
npm run dev
```

The development server prints its local URL in the terminal.

Useful checks:

```bash
npm run lint
npm run typecheck
npm run build
```

## Environment variables

Copy `.env.example` to `.env.local` and configure:

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Server-side Resend API key |
| `RESEND_FROM_EMAIL` | Sender on a domain verified in Resend |
| `LARSEN_CONTACT_EMAIL` | Larsen & Co. destination address |
| `NEXT_PUBLIC_SITE_URL` | Optional trusted public origin for metadata, sitemap, and robots output |

No real keys or email addresses are included in this repository. `NEXT_PUBLIC_SITE_URL` may be left blank for the configured demo origin. Missing mail values do not break public pages; the contact endpoint returns a controlled unavailable response until the mail setup is complete.

## Resend setup

1. Verify the sender domain in Resend.
2. Create a sending API key with the narrowest appropriate permissions.
3. Configure all three environment variables in local development and the hosting environment.
4. Submit a controlled test enquiry and confirm delivery and reply behavior.

The server route validates and limits input, silently handles the honeypot field, applies best-effort in-memory rate limiting, escapes all user content used in HTML, sends a plain-text fallback, and sets the visitor address as `reply_to`. Secrets never reach client JavaScript.

Automatic visitor confirmation is intentionally not enabled. It can be added later when the final sender domain and content are approved.

## Routes

- `/` — homepage
- `/om-os` — about Larsen & Co. and the owners
- `/kompetencer` — confirmed competency areas
- `/projekter` — accessible visual gallery and lightbox
- `/kontakt` — contact details and Resend-backed form
- branded 404, sitemap, and robots metadata

## Content architecture

Confirmed, reusable business content lives in `data/site.ts`:

- `company` — name, location, phone, experience message
- `navigation` — primary site navigation
- `competencies` — confirmed service categories
- `owners` — owner names, roles, reference imagery
- `projects` — neutral visual-gallery records ready for later project metadata
- `pendingContent` — client confirmation checklist

To update an owner, competency, or project, edit the relevant array rather than individual page components. Project records already support an ID, label, image, alt text, and orientation; fields such as project name, location, year, client, and description can be added when verified.

The owner records include a code note that the current images are temporary references. Replace their image paths when a matched professional portrait set is available; the layout accepts varied source proportions.

## Assets

Production assets are organized under:

```text
public/images/larsen-co/
├── logos/
├── owners/
└── work/
```

The supplied photo PNGs were converted to high-quality JPEG copies for much smaller browser transfers. Logo files remain PNG so the authentic artwork is preserved. The site never reads from the original ZIP at runtime.

`public/og.png` is the branded 1200 × 630 social-sharing image. It was composed from the supplied waterfront work photograph and Larsen & Co. logo; the exact generation brief is recorded in `docs/og-image-prompt.md`.

## Deployment

The project is configured for OpenAI Sites through `.openai/hosting.json` and `vite.config.ts`. Before a production launch:

1. configure the three Resend variables in the hosted environment;
2. set the final trusted site origin for metadata, sitemap, and robots output if the deployment URL changes;
3. run lint, type checking, and a production build;
4. submit one controlled contact-form test;
5. verify the sender domain and destination with BB Digital and Larsen & Co.

## Information still requiring Larsen & Co. confirmation

- business email address
- physical address
- owner titles beyond “Ejer”
- complete service list
- exact project names and details
- final professional owner portraits
- any additional business or company text

These items are intentionally omitted or represented by neutral content. No customer names, testimonials, certifications, project facts, company history, or other unverified business claims were invented.
