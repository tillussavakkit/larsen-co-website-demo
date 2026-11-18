import { getDb, getMediaBucket } from '@/db';
import { mediaAssets } from '@/db/schema';
import { authorizeAdminApi } from '@/lib/admin-auth';
import { listMedia, mediaUrl, recordAudit } from '@/lib/cms-repository';
import { safeMediaFilename, validateMediaFile } from '@/lib/media-validation';
import { sameOriginError } from '@/lib/request-security';

export const dynamic = 'force-dynamic';

export async function GET() {
  const auth = await authorizeAdminApi();
  if (!auth.ok) return auth.response;

  try {
    return Response.json({ media: await listMedia() });
  } catch {
    return Response.json({ error: 'Mediebiblioteket kunne ikke hentes.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await authorizeAdminApi();
  if (!auth.ok) return auth.response;
  const originError = sameOriginError(request);
  if (originError) return originError;

  const contentLength = request.headers.get('content-length');
  if (contentLength) {
    const requestBytes = Number(contentLength);
    if (!Number.isFinite(requestBytes) || requestBytes < 0) {
      return Response.json({ error: 'Uploaden har en ugyldig størrelse.' }, { status: 400 });
    }
    if (requestBytes > 9 * 1024 * 1024) {
      return Response.json({ error: 'Billedet må højst fylde 8 MB.' }, { status: 413 });
    }
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: 'Uploaden kunne ikke læses.' }, { status: 400 });
  }

  const file = formData.get('file');
  if (!(file instanceof File)) {
    return Response.json({ error: 'Vælg et billede at uploade.' }, { status: 400 });
  }
  const validation = await validateMediaFile(file);
  if (!validation.success) {
    return Response.json({ error: validation.error }, { status: 400 });
  }

  const altText = String(formData.get('altText') ?? '').trim().slice(0, 240);
  const id = crypto.randomUUID();
  const date = new Date();
  const objectKey = `cms/${date.getUTCFullYear()}/${id}-${safeMediaFilename(file.name)}.${validation.extension}`;

  try {
    await getMediaBucket().put(objectKey, new Uint8Array(validation.bytes), {
      httpMetadata: {
        contentType: validation.mime,
      },
      customMetadata: { originalFilename: file.name.slice(0, 180) },
    });

    const [media] = await getDb()
      .insert(mediaAssets)
      .values({
        id,
        objectKey,
        filename: file.name.slice(0, 180),
        mimeType: validation.mime,
        sizeBytes: file.size,
        altText,
        uploadedBy: auth.user.userId,
      })
      .returning();

    await recordAudit(auth.user, 'media.uploaded', 'media', id, {
      filename: media.filename,
      sizeBytes: media.sizeBytes,
    });
    return Response.json({ media: { ...media, url: mediaUrl(media.objectKey) } }, { status: 201 });
  } catch {
    await getMediaBucket().delete(objectKey).catch(() => undefined);
    return Response.json({ error: 'Billedet kunne ikke uploades.' }, { status: 500 });
  }
}
