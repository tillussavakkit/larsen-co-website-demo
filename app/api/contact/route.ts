import { NextResponse } from 'next/server';
import { buildContactEmail, validateContactPayload } from '@/lib/contact';

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const MAX_BODY_BYTES = 20_000;
const attempts = new Map<string, number[]>();

function clientKey(request: Request) {
  return (
    request.headers.get('cf-connecting-ip') ??
    request.headers.get('x-real-ip') ??
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'anonymous'
  );
}

function rateLimit(key: string) {
  const now = Date.now();
  const recent = (attempts.get(key) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
  );

  if (recent.length >= RATE_LIMIT_MAX) {
    attempts.delete(key);
    attempts.set(key, recent);
    return {
      limited: true,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((recent[0] + RATE_LIMIT_WINDOW_MS - now) / 1_000),
      ),
    };
  }

  recent.push(now);
  attempts.delete(key);
  attempts.set(key, recent);

  if (attempts.size > 1_000) {
    const leastRecentlyUsedKey = attempts.keys().next().value;
    if (leastRecentlyUsedKey) attempts.delete(leastRecentlyUsedKey);
  }

  return { limited: false, retryAfterSeconds: 0 };
}

async function readLimitedJson(request: Request) {
  const reader = request.body?.getReader();
  if (!reader) return { ok: false as const, status: 400 as const };

  const decoder = new TextDecoder();
  let byteLength = 0;
  let text = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      byteLength += value.byteLength;
      if (byteLength > MAX_BODY_BYTES) {
        await reader.cancel();
        return { ok: false as const, status: 413 as const };
      }

      text += decoder.decode(value, { stream: true });
    }

    text += decoder.decode();
    return { ok: true as const, body: JSON.parse(text) as unknown };
  } catch {
    return { ok: false as const, status: 400 as const };
  }
}

export async function POST(request: Request) {
  const contentType = request.headers
    .get('content-type')
    ?.split(';', 1)[0]
    .trim()
    .toLowerCase();
  if (contentType !== 'application/json') {
    return NextResponse.json({ ok: false }, { status: 415 });
  }

  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false }, { status: 413 });
  }

  const limit = rateLimit(clientKey(request));
  if (limit.limited) {
    return NextResponse.json(
      { ok: false },
      {
        status: 429,
        headers: { 'Retry-After': String(limit.retryAfterSeconds) },
      },
    );
  }

  const bodyResult = await readLimitedJson(request);
  if (!bodyResult.ok) {
    return NextResponse.json({ ok: false }, { status: bodyResult.status });
  }

  const result = validateContactPayload(bodyResult.body);
  if (!result.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Silently accept honeypot submissions so automated senders receive no signal.
  if (result.data.website) {
    return NextResponse.json({ ok: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const recipients = (process.env.LARSEN_CONTACT_EMAIL ?? '')
    .split(',')
    .map((email) => email.trim())
    .filter(Boolean);

  if (!apiKey || !from || recipients.length === 0) {
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  const { html, text } = buildContactEmail(result.data);

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': crypto.randomUUID(),
      },
      body: JSON.stringify({
        from,
        to: recipients,
        reply_to: result.data.email,
        subject: 'Ny forespørgsel via Larsen & Co.s hjemmeside',
        html,
        text,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ ok: false }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 502 });
  }
}
