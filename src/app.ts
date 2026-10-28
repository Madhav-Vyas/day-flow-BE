import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import apiRoutes from './routes';
import { notFoundHandler } from './middleware/notFoundHandler';
import { errorHandler } from './middleware/errorHandler';

export const createApp = (): Application => {
  const app = express();

  // Security Middlewares
  app.use(helmet());
  app.use(
    cors({
      origin: env.CLIENT_URL === '*' ? '*' : [env.CLIENT_URL, 'http://localhost:3000'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Request Logging
  app.use(morgan(env.isProduction ? 'combined' : 'dev'));

  // Body Parsing Middlewares
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Root Welcome Endpoint
  app.get('/', (_req: Request, res: Response) => {
    res.json({
      name: 'Day Flow Backend API',
      status: 'active',
      apiVersion: 'v1',
      endpoints: {
        api: '/api/v1',
        health: '/api/v1/health',
      },
    });
  });

  // API Routes
  app.use('/api/v1', apiRoutes);

  // 404 Route Handler
  app.use(notFoundHandler);

  // Global Error Handler
  app.use(errorHandler);

  return app;
};
