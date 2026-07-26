const buckets = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, limit: number = 30, windowMs: number = 60000): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (bucket.count >= limit) return false;
  bucket.count++;
  return true;
}

export function getRateLimitHeaders(key: string, limit: number = 30, windowMs: number = 60000) {
  const bucket = buckets.get(key);
  const remaining = bucket ? Math.max(0, limit - bucket.count) : limit;
  const reset = bucket ? Math.ceil((bucket.resetAt - Date.now()) / 1000) : Math.ceil(windowMs / 1000);
  return {
    "X-RateLimit-Limit": String(limit),
    "X-RateLimit-Remaining": String(remaining),
    "X-RateLimit-Reset": String(reset),
  };
}

setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (now > bucket.resetAt) buckets.delete(key);
  }
}, 60000);
