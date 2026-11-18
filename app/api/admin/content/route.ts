import { sql } from 'drizzle-orm/sql';
import { getDb } from '@/db';
import { siteContent } from '@/db/schema';
import { authorizeAdminApi } from '@/lib/admin-auth';
import {
  contentDefinitionByKey,
  contentDefaults,
} from '@/lib/content-definitions';
import { recordAudit } from '@/lib/cms-repository';
import { readJsonWithLimit, sameOriginError } from '@/lib/request-security';
import { getContentPages } from '@/lib/site-content';

export const dynamic = 'force-dynamic';

export async function GET() {
  const auth = await authorizeAdminApi();
  if (!auth.ok) return auth.response;

  try {
    const rows = await getDb().select().from(siteContent);
    const values = contentDefaults();
    for (const row of rows) {
      if (contentDefinitionByKey.has(row.key)) values[row.key] = row.value;
    }
    return Response.json({ pages: getContentPages(values) });
  } catch {
    return Response.json({ error: 'Sideindholdet kunne ikke hentes.' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const auth = await authorizeAdminApi();
  if (!auth.ok) return auth.response;
  const originError = sameOriginError(request);
  if (originError) return originError;

  const body = await readJsonWithLimit(
    request,
    150_000,
    'Ugyldige indholdsdata.',
    'Indholdsdataene er for store.',
  );
  if (!body.ok) return body.response;
  const payload = body.value;

  const rawValues =
    payload && typeof payload === 'object'
      ? (payload as { values?: unknown }).values
      : null;
  if (!rawValues || typeof rawValues !== 'object' || Array.isArray(rawValues)) {
    return Response.json({ error: 'Der mangler indhold at gemme.' }, { status: 400 });
  }

  const now = new Date().toISOString();
  const rows: Array<{
    key: string;
    pageKey: string;
    value: string;
    updatedBy: string;
    updatedAt: string;
  }> = [];

  for (const [key, rawValue] of Object.entries(rawValues)) {
    const definition = contentDefinitionByKey.get(key);
    if (!definition || typeof rawValue !== 'string') continue;
    const value = rawValue.trim().slice(0, definition.maxLength ?? 2_000);
    rows.push({
      key,
      pageKey: definition.page,
      value,
      updatedBy: auth.user.userId,
      updatedAt: now,
    });
  }

  if (!rows.length) {
    return Response.json({ error: 'Ingen gyldige felter blev sendt.' }, { status: 400 });
  }

  try {
    for (const rowChunk of chunks(rows, 15)) {
      await getDb()
        .insert(siteContent)
        .values(rowChunk)
        .onConflictDoUpdate({
          target: siteContent.key,
          set: {
            value: sql`excluded.value`,
            pageKey: sql`excluded.page_key`,
            updatedBy: sql`excluded.updated_by`,
            updatedAt: sql`excluded.updated_at`,
          },
        });
    }

    await recordAudit(auth.user, 'content.updated', 'site_content', 'bulk', {
      keys: rows.map((row) => row.key),
    });
    const values = contentDefaults();
    const savedRows = await getDb().select().from(siteContent);
    for (const row of savedRows) {
      if (contentDefinitionByKey.has(row.key)) values[row.key] = row.value;
    }
    return Response.json({ pages: getContentPages(values) });
  } catch {
    return Response.json({ error: 'Sideindholdet kunne ikke gemmes.' }, { status: 500 });
  }
}

function chunks<T>(values: T[], size: number) {
  const output: T[][] = [];
  for (let index = 0; index < values.length; index += size) {
    output.push(values.slice(index, index + size));
  }
  return output;
}
