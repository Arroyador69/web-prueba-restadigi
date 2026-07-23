type RateLimitResult = { ok: true } | { ok: false; retryAfterSec: number };

type Bucket = { timestamps: number[] };

const buckets = new Map<string, Bucket>();

const CLEANUP_EVERY = 200;
let hitsSinceCleanup = 0;

function cleanup(now: number) {
  for (const [key, bucket] of buckets) {
    bucket.timestamps = bucket.timestamps.filter((t) => now - t < 60 * 60_000);
    if (bucket.timestamps.length === 0) buckets.delete(key);
  }
}

/** Sliding-window rate limit (in-memory; per serverless instance). */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  hitsSinceCleanup += 1;
  if (hitsSinceCleanup >= CLEANUP_EVERY) {
    hitsSinceCleanup = 0;
    cleanup(now);
  }

  const bucket = buckets.get(key) ?? { timestamps: [] };
  bucket.timestamps = bucket.timestamps.filter((t) => now - t < windowMs);

  if (bucket.timestamps.length >= limit) {
    const oldest = bucket.timestamps[0] ?? now;
    const retryAfterSec = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
    buckets.set(key, bucket);
    return { ok: false, retryAfterSec };
  }

  bucket.timestamps.push(now);
  buckets.set(key, bucket);
  return { ok: true };
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export const RATE_LIMITS = {
  chat: { limit: 20, windowMs: 60_000 },
  login: { limit: 10, windowMs: 15 * 60_000 },
  track: { limit: 60, windowMs: 60_000 },
  public: { limit: 60, windowMs: 60_000 },
  auth: { limit: 60, windowMs: 60_000 },
  dashboard: { limit: 120, windowMs: 60_000 },
} as const;

export type RateLimitBucket = keyof typeof RATE_LIMITS;

/** Returns a 429 Response when limited, otherwise null. */
export function enforceRateLimit(
  request: Request,
  bucket: RateLimitBucket,
  suffix = "",
): Response | null {
  const { limit, windowMs } = RATE_LIMITS[bucket];
  const key = `${bucket}${suffix}:${clientIp(request)}`;
  const result = rateLimit(key, limit, windowMs);
  if (result.ok) return null;

  return Response.json(
    { error: "Liian monta pyyntöä. Odota hetki ja yritä uudelleen." },
    {
      status: 429,
      headers: {
        "Retry-After": String(result.retryAfterSec),
        "Cache-Control": "no-store",
      },
    },
  );
}
