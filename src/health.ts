import type { Middleware, HealthCheckOptions } from './types.js';

export function healthCheck(options: HealthCheckOptions = {}): Middleware {
  const { checks = {} } = options;

  return async (_ctx, next) => {
    const results: Record<string, boolean> = {};
    let healthy = true;

    for (const [name, check] of Object.entries(checks)) {
      try {
        results[name] = await check();
        if (!results[name]) healthy = false;
      } catch {
        results[name] = false;
        healthy = false;
      }
    }

    if (!healthy) {
      throw new Error('Health check failed');
    }

    await next();
  };
}
