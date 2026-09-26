# node-api-toolkit

A lightweight, zero-dependency toolkit for building production-ready Node.js APIs with TypeScript.

## Features

- **Request validation** — Schema-based input validation with detailed error messages
- **Error handling** — Structured error responses with proper HTTP status codes
- **Rate limiting** — Token bucket rate limiter with sliding window support
- **Health checks** — Configurable health check endpoints with dependency monitoring
- **Logging** — Structured JSON logger with request correlation IDs
- **Middleware** — Composable middleware pipeline with async support

## Installation

```bash
npm install node-api-toolkit
```

## Quick Start

```typescript
import { createApi, validate, rateLimit } from 'node-api-toolkit';

const api = createApi({
  port: 3000,
  middleware: [rateLimit({ max: 100, window: '1m' })],
});

api.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

api.post('/users', validate(userSchema), async (req, res) => {
  const user = await createUser(req.body);
  res.status(201).json(user);
});

api.listen();
```

## API Reference

### `createApi(options)`

Creates a new API instance.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `port` | `number` | `3000` | Port to listen on |
| `host` | `string` | `'0.0.0.0'` | Host to bind to |
| `middleware` | `Middleware[]` | `[]` | Global middleware |

### `validate(schema)`

Returns middleware that validates request body against the provided schema.

### `rateLimit(options)`

Returns middleware that applies rate limiting using a token bucket algorithm.

## License

MIT
