export interface ShutdownOptions {
  timeout?: number;
  signals?: NodeJS.Signals[];
  onShutdown?: () => Promise<void>;
}

export function gracefulShutdown(options: ShutdownOptions = {}): void {
  const { timeout = 10_000, signals = ['SIGTERM', 'SIGINT'], onShutdown } = options;
  let isShuttingDown = false;

  for (const signal of signals) {
    process.on(signal, async () => {
      if (isShuttingDown) return;
      isShuttingDown = true;

      console.log(`Received ${signal}, starting graceful shutdown...`);

      const timer = setTimeout(() => {
        console.error('Shutdown timeout exceeded, forcing exit');
        process.exit(1);
      }, timeout);

      try {
        if (onShutdown) await onShutdown();
        clearTimeout(timer);
        process.exit(0);
      } catch (err) {
        console.error('Error during shutdown:', err);
        clearTimeout(timer);
        process.exit(1);
      }
    });
  }
}
