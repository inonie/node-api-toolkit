import type { Middleware, RateLimitOptions, Context } from './types.js';

interface TokenBucket {
  tokens: number;
  lastRefill: number;
}

export function rateLimit(options: RateLimitOptions): Middleware {
  const { max, window: windowStr, keyGenerator } = options;
  const windowMs = parseWindow(windowStr);
  const buckets = new Map<string, TokenBucket>();

  return async (ctx, next) => {
    const key = keyGenerator ? keyGenerator(ctx) : ctx.headers['x-forwarded-for'] ?? 'default';
    const now = Date.now();
    let bucket = buckets.get(key);

    if (!bucket) {
      bucket = { tokens: max, lastRefill: now };
      buckets.set(key, bucket);
    }

    const elapsed = now - bucket.lastRefill;
    const refillRate = max / windowMs;
    bucket.tokens = Math.min(max, bucket.tokens + elapsed * refillRate);
    bucket.lastRefill = now;

    if (bucket.tokens < 1) {
      throw new RateLimitError('Rate limit exceeded');
    }

    bucket.tokens -= 1;
    await next();
  };
}

function parseWindow(window: string): number {
  const match = window.match(/^(\d+)(s|m|h)$/);
  if (!match) throw new Error(\`Invalid window format: \${window}\`);
  const [, value, unit] = match;
  const multipliers: Record<string, number> = { s: 1000, m: 60_000, h: 3_600_000 };
  return parseInt(value) * multipliers[unit];
}

export class RateLimitError extends Error {
  readonly statusCode = 429;
  constructor(message: string) {
    super(message);
    this.name = 'RateLimitError';
  }
}
