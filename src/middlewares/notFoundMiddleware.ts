import { Request, Response } from 'express';
import { ApiResponse } from '../types/auth';

// 404 Not Found middleware
export const notFound = (req: Request, res: Response<ApiResponse>): void => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    error: 'The requested resource does not exist',
  });
};