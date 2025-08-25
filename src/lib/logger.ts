const logger = {
  info: (message: string, data?: unknown) => {
    if (typeof window !== 'undefined') {
      console.log(`[INFO] ${message}`, data);
    }
  },
  error: (message: string, error?: unknown) => {
    if (typeof window !== 'undefined') {
      console.error(`[ERROR] ${message}`, error);
    }
  },
  warn: (message: string, data?: unknown) => {
    if (typeof window !== 'undefined') {
      console.warn(`[WARN] ${message}`, data);
    }
  },
  debug: (message: string, data?: unknown) => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${message}`, data);
    }
  }
};

export default logger;
