import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';
import { logger } from '../utils/logger';
import { env } from '../config/env';

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let details = err.details || undefined;

  // Handle Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = `Invalid ID format for resource identifier '${err.value}'`;
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Failed';
    details = Object.values(err.errors || {}).map((item: any) => ({
      field: item.path,
      message: item.message,
    }));
  }

  // Handle Mongoose Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 409;
    const fields = Object.keys(err.keyValue || {});
    message = `Duplicate value for field(s): ${fields.join(', ')}`;
  }

  if (statusCode >= 500) {
    logger.error(`[Unhandled Error] ${err.stack || err.message}`);
  } else {
    logger.warn(`[Client Error] [${statusCode}] ${message}`);
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    ...(details && { details }),
    ...(env.isDevelopment && { stack: err.stack }),
  });
};
