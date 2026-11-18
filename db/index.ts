import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { createClient } from '@supabase/supabase-js';
import * as schema from './schema';

function createDb() {
  const url = process.env.DATABASE_URL;
  const encodedCa = process.env.DATABASE_CA_CERT_B64;

  if (!url || !encodedCa) {
    throw new Error('PostgreSQL environment is not configured.');
  }

  const pool = new Pool({
    connectionString: url,
    max: 1,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 10000,
    ssl: {
      ca: Buffer.from(encodedCa, 'base64').toString('utf8'),
      rejectUnauthorized: true,
    },
  });

  return drizzle({ client: pool, schema });
}

let database: ReturnType<typeof createDb> | undefined;

export function getDb() {
  database ??= createDb();
  return database;
}

function getStorage() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;

  if (!url || !key) {
    throw new Error('Supabase Storage is not configured.');
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }).storage.from('larsen-media');
}

// Compatibility interface for the existing CMS media routes.
export function getMediaBucket() {
  return {
    async put(
      key: string,
      bytes: Uint8Array,
      options: {
        httpMetadata?: { contentType?: string };
        customMetadata?: Record<string, string>;
      } = {},
    ) {
      const { error } = await getStorage().upload(key, bytes, {
        contentType: options.httpMetadata?.contentType,
        metadata: options.customMetadata,
        upsert: false,
      });

      if (error) throw error;
    },

    async get(key: string) {
      const { data, error } = await getStorage().download(key);

      if (error) {
        if ('statusCode' in error && Number(error.statusCode) === 404) {
          return null;
        }
        throw error;
      }

      if (!data) return null;

      return {
        body: data.stream(),
        writeHttpMetadata(headers: Headers) {
          headers.set(
            'content-type',
            data.type || 'application/octet-stream',
          );
        },
      };
    },

    async delete(key: string) {
      const { error } = await getStorage().remove([key]);
      if (error) throw error;
    },
  };
}
