type LogLevel = 'info' | 'warn' | 'error' | 'success' | 'debug';

const getTimestamp = (): string => new Date().toISOString();

export const logger = {
  info: (message: string, ...args: unknown[]) => {
    console.log(`[${getTimestamp()}] [INFO] ${message}`, ...args);
  },
  success: (message: string, ...args: unknown[]) => {
    console.log(`[${getTimestamp()}] [SUCCESS] \x1b[32m${message}\x1b[0m`, ...args);
  },
  warn: (message: string, ...args: unknown[]) => {
    console.warn(`[${getTimestamp()}] [WARN] \x1b[33m${message}\x1b[0m`, ...args);
  },
  error: (message: string, ...args: unknown[]) => {
    console.error(`[${getTimestamp()}] [ERROR] \x1b[31m${message}\x1b[0m`, ...args);
  },
  debug: (message: string, ...args: unknown[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[${getTimestamp()}] [DEBUG] \x1b[36m${message}\x1b[0m`, ...args);
    }
  },
};
