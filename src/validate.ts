import type { Middleware } from './types.js';

interface SchemaField {
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

type Schema = Record<string, SchemaField>;

export function validate(schema: Schema): Middleware {
  return async (ctx, next) => {
    const body = ctx.body as Record<string, unknown> | null;
    if (!body || typeof body !== 'object') {
      throw new ValidationError('Request body must be a JSON object');
    }

    for (const [field, rules] of Object.entries(schema)) {
      const value = body[field];

      if (rules.required && (value === undefined || value === null)) {
        throw new ValidationError(\`Field "\${field}" is required\`);
      }

      if (value !== undefined && value !== null) {
        if (typeof value !== rules.type) {
          throw new ValidationError(\`Field "\${field}" must be of type \${rules.type}\`);
        }
        if (rules.type === 'string' && typeof value === 'string') {
          if (rules.minLength && value.length < rules.minLength) {
            throw new ValidationError(\`Field "\${field}" must be at least \${rules.minLength} characters\`);
          }
          if (rules.maxLength && value.length > rules.maxLength) {
            throw new ValidationError(\`Field "\${field}" must be at most \${rules.maxLength} characters\`);
          }
        }
      }
    }
    await next();
  };
}

export class ValidationError extends Error {
  readonly statusCode = 400;
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}
