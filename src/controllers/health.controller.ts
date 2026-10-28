import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { sendResponse } from '../utils/apiResponse';
import { env } from '../config/env';

export class HealthController {
  static getHealth(_req: Request, res: Response): void {
    const dbStateMap: Record<number, string> = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };

    const dbStatus = dbStateMap[mongoose.connection.readyState] || 'unknown';

    sendResponse({
      res,
      statusCode: 200,
      message: 'Day Flow Backend API is running smoothly',
      data: {
        service: 'day-flow-be',
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptimeSeconds: Math.floor(process.uptime()),
        environment: env.NODE_ENV,
        database: {
          status: dbStatus,
          readyState: mongoose.connection.readyState,
        },
      },
    });
  }
}
