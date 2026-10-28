import { Response } from 'express';

export interface ApiResponseOptions<T> {
  res: Response;
  statusCode?: number;
  message?: string;
  data?: T;
  meta?: Record<string, unknown>;
}

export const sendResponse = <T>({
  res,
  statusCode = 200,
  message,
  data,
  meta,
}: ApiResponseOptions<T>) => {
  return res.status(statusCode).json({
    success: true,
    ...(message && { message }),
    ...(data !== undefined && { data }),
    ...(meta && { meta }),
  });
};
