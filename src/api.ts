import type { ApiOptions, Middleware, Context } from './types.js';
import { randomUUID } from 'node:crypto';

export function createApi(options: ApiOptions = {}) {
  const { port = 3000, host = '0.0.0.0', middleware = [] } = options;
  const routes: Map<string, Map<string, Middleware>> = new Map();

  function addRoute(method: string, path: string, handler: Middleware) {
    if (!routes.has(method)) routes.set(method, new Map());
    routes.get(method)!.set(path, handler);
  }

  async function handleRequest(ctx: Context, handler: Middleware): Promise<void> {
    const chain = [...middleware, handler];
    let index = 0;
    const next = async (): Promise<void> => {
      if (index < chain.length) {
        const fn = chain[index++];
        await fn(ctx, next);
      }
    };
    await next();
  }

  return {
    get: (path: string, ...handlers: Middleware[]) => addRoute('GET', path, handlers[handlers.length - 1]),
    post: (path: string, ...handlers: Middleware[]) => addRoute('POST', path, handlers[handlers.length - 1]),
    put: (path: string, ...handlers: Middleware[]) => addRoute('PUT', path, handlers[handlers.length - 1]),
    delete: (path: string, ...handlers: Middleware[]) => addRoute('DELETE', path, handlers[handlers.length - 1]),
    listen: () => console.log(\`API listening on \${host}:\${port}\`),
    handleRequest,
    _createContext: (): Context => ({
      params: {}, query: {}, body: null, headers: {},
      requestId: randomUUID(),
    }),
  };
}
