export interface ApiOptions {
  port?: number;
  host?: string;
  middleware?: Middleware[];
}

export interface Context {
  params: Record<string, string>;
  query: Record<string, string>;
  body: unknown;
  headers: Record<string, string>;
  requestId: string;
}

export type Middleware = (
  ctx: Context,
  next: () => Promise<void>
) => Promise<void>;

export interface Logger {
  info(message: string, meta?: Record<string, unknown>): void;
  warn(message: string, meta?: Record<string, unknown>): void;
  error(message: string, meta?: Record<string, unknown>): void;
  debug(message: string, meta?: Record<string, unknown>): void;
}

export interface RateLimitOptions {
  max: number;
  window: string;
  keyGenerator?: (ctx: Context) => string;
}

export interface HealthCheckOptions {
  path?: string;
  checks?: Record<string, () => Promise<boolean>>;
}
