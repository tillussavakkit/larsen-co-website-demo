export function sameOriginError(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin) return null;

  let expectedOrigin: string;
  try {
    expectedOrigin = new URL(request.url).origin;
  } catch {
    return Response.json({ error: 'Ugyldig forespørgsel.' }, { status: 400 });
  }

  if (origin !== expectedOrigin) {
    return Response.json(
      { error: 'Forespørgslen kom fra en ukendt side.' },
      { status: 403 },
    );
  }

  return null;
}

export async function readJsonWithLimit(
  request: Request,
  maxBytes: number,
  invalidMessage: string,
  tooLargeMessage: string,
) {
  const contentLength = request.headers.get('content-length');
  if (contentLength) {
    const statedBytes = Number(contentLength);
    if (!Number.isFinite(statedBytes) || statedBytes < 0) {
      return {
        ok: false as const,
        response: Response.json({ error: invalidMessage }, { status: 400 }),
      };
    }
    if (statedBytes > maxBytes) {
      return {
        ok: false as const,
        response: Response.json({ error: tooLargeMessage }, { status: 413 }),
      };
    }
  }

  if (!request.body) {
    return {
      ok: false as const,
      response: Response.json({ error: invalidMessage }, { status: 400 }),
    };
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > maxBytes) {
        await reader.cancel();
        return {
          ok: false as const,
          response: Response.json({ error: tooLargeMessage }, { status: 413 }),
        };
      }
      chunks.push(value);
    }

    const body = new Uint8Array(totalBytes);
    let offset = 0;
    for (const chunk of chunks) {
      body.set(chunk, offset);
      offset += chunk.byteLength;
    }

    return {
      ok: true as const,
      value: JSON.parse(new TextDecoder().decode(body)) as unknown,
    };
  } catch {
    return {
      ok: false as const,
      response: Response.json({ error: invalidMessage }, { status: 400 }),
    };
  } finally {
    reader.releaseLock();
  }
}
