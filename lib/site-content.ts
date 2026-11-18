import { inArray } from 'drizzle-orm/sql/expressions/conditions';
import { getDb } from '@/db';
import { siteContent } from '@/db/schema';
import {
  contentDefinitionByKey,
  contentDefinitions,
  contentDefaults,
} from '@/lib/content-definitions';

export async function getSiteContent(...pages: string[]) {
  const values = contentDefaults();
  const wantedPages = Array.from(new Set(['global', ...pages]));

  try {
    const rows = await getDb()
      .select({ key: siteContent.key, value: siteContent.value })
      .from(siteContent)
      .where(inArray(siteContent.pageKey, wantedPages));

    for (const row of rows) {
      if (contentDefinitionByKey.has(row.key)) values[row.key] = row.value;
    }
  } catch {
    // Public pages keep their verified source defaults until storage is provisioned.
  }

  return values;
}

export function getContentPages(values: Record<string, string>) {
  const pageMap = new Map<
    string,
    {
      id: string;
      label: string;
      sections: Array<{
        label: string;
        fields: Array<{
          key: string;
          label: string;
          type: string;
          value: string;
          maxLength?: number;
        }>;
      }>;
    }
  >();

  for (const definition of contentDefinitions) {
    let page = pageMap.get(definition.page);
    if (!page) {
      page = { id: definition.page, label: definition.pageLabel, sections: [] };
      pageMap.set(definition.page, page);
    }

    let section = page.sections.find((entry) => entry.label === definition.section);
    if (!section) {
      section = { label: definition.section, fields: [] };
      page.sections.push(section);
    }

    section.fields.push({
      key: definition.key,
      label: definition.label,
      type: definition.type,
      value: values[definition.key] ?? definition.defaultValue,
      maxLength: definition.maxLength,
    });
  }

  return Array.from(pageMap.values());
}
