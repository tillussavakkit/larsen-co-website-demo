const MAX_MEDIA_BYTES = 8 * 1024 * 1024;

const extensionByMime = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
} as const;

export async function validateMediaFile(file: File) {
  if (file.size <= 0) return { success: false as const, error: 'Filen er tom.' };
  if (file.size > MAX_MEDIA_BYTES) {
    return { success: false as const, error: 'Billedet må højst fylde 8 MB.' };
  }

  const mime = file.type as keyof typeof extensionByMime;
  if (!extensionByMime[mime]) {
    return {
      success: false as const,
      error: 'Brug JPG, PNG, WebP eller AVIF.',
    };
  }

  const bytes = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  if (!matchesMagicBytes(mime, bytes)) {
    return {
      success: false as const,
      error: 'Filens indhold svarer ikke til den valgte billedtype.',
    };
  }

  return {
    success: true as const,
    mime,
    extension: extensionByMime[mime],
    bytes: await file.arrayBuffer(),
  };
}

export function safeMediaFilename(filename: string) {
  const base = filename
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70);
  return base || 'billede';
}

function matchesMagicBytes(mime: keyof typeof extensionByMime, bytes: Uint8Array) {
  if (mime === 'image/jpeg') {
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }
  if (mime === 'image/png') {
    return [0x89, 0x50, 0x4e, 0x47].every((value, index) => bytes[index] === value);
  }
  if (mime === 'image/webp') {
    return text(bytes, 0, 4) === 'RIFF' && text(bytes, 8, 12) === 'WEBP';
  }
  return text(bytes, 4, 8) === 'ftyp' && ['avif', 'avis'].includes(text(bytes, 8, 12));
}

function text(bytes: Uint8Array, start: number, end: number) {
  return String.fromCharCode(...bytes.slice(start, end));
}
