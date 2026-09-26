import type { Logger } from './types.js';

export function createLogger(name: string): Logger {
  function log(level: string, message: string, meta?: Record<string, unknown>) {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      name,
      message,
      ...meta,
    };
    const output = JSON.stringify(entry);
    if (level === 'error') process.stderr.write(output + '\n');
    else process.stdout.write(output + '\n');
  }

  return {
    info: (msg, meta) => log('info', msg, meta),
    warn: (msg, meta) => log('warn', msg, meta),
    error: (msg, meta) => log('error', msg, meta),
    debug: (msg, meta) => log('debug', msg, meta),
  };
}
