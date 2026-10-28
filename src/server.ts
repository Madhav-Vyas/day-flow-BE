import http from 'http';
import { createApp } from './app';
import { env } from './config/env';
import { connectDatabase, disconnectDatabase } from './config/db';
import { logger } from './utils/logger';

const startServer = async (): Promise<void> => {
  // 1. Connect to Database
  await connectDatabase();

  // 2. Initialize Express App
  const app = createApp();
  const server = http.createServer(app);

  // 3. Start Listening
  server.listen(env.PORT, () => {
    logger.success(`==============================================`);
    logger.success(`🚀 Day Flow Backend Server is running!`);
    logger.success(`📡 Environment: ${env.NODE_ENV}`);
    logger.success(`🌐 Server URL:  http://localhost:${env.PORT}`);
    logger.success(`🩺 Health Check: http://localhost:${env.PORT}/api/v1/health`);
    logger.success(`==============================================`);
  });

  // 4. Graceful Shutdown
  const gracefulShutdown = async (signal: string) => {
    logger.info(`Received ${signal}. Starting graceful shutdown...`);

    server.close(async () => {
      logger.info('HTTP server closed.');
      await disconnectDatabase();
      logger.info('Process terminated gracefully.');
      process.exit(0);
    });

    // Force shutdown after timeout
    setTimeout(() => {
      logger.error('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

  process.on('unhandledRejection', (reason: unknown) => {
    logger.error('Unhandled Rejection at:', reason);
  });

  process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception thrown:', error);
    process.exit(1);
  });
};

startServer().catch((error) => {
  logger.error('Fatal error during server startup:', error);
  process.exit(1);
});
