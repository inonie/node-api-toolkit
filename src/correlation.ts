import { randomUUID } from 'node:crypto';
import type { Middleware } from './types.js';

const HEADER_NAME = 'x-request-id';

export function correlationId(): Middleware {
  return async (ctx, next) => {
    const existing = ctx.headers[HEADER_NAME];
    ctx.requestId = existing ?? randomUUID();
    await next();
  };
}
