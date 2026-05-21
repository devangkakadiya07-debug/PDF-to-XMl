const WINDOW_MS = 60_000;
const LIMIT = 120;

type Entry = { count: number; resetAt: number };

const globalForRate = globalThis as unknown as {
  convertRateLimit: Map<string, Entry> | undefined;
};

const bucket = globalForRate.convertRateLimit ?? new Map<string, Entry>();
if (!globalForRate.convertRateLimit) globalForRate.convertRateLimit = bucket;

export function consumeRateLimit(key: string) {
  const now = Date.now();
  const current = bucket.get(key);

  if (!current || now > current.resetAt) {
    bucket.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true, remaining: LIMIT - 1 };
  }

  if (current.count >= LIMIT) {
    return { ok: false, remaining: 0 };
  }

  current.count += 1;
  bucket.set(key, current);
  return { ok: true, remaining: LIMIT - current.count };
}
