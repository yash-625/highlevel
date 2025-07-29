import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types/auth';

// Custom error class
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Global error handling middleware
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response<ApiResponse>,
  _next: NextFunction
): void => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error('❌ Error:', err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new AppError(message, 404);
  }

  // Mongoose duplicate key
  if ((err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue ?? {})[0];
    const message = field ?`${field?.charAt(0).toUpperCase() + field?.slice(1)} already exists`: 'Mongoose duplicate key error';
    error = new AppError(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values((err as any).errors).map((val: any) => val.message).join(', ');
    error = new AppError(message, 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = new AppError(message, 401);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = new AppError(message, 401);
  }

  // Determine status code
  const statusCode = (error as AppError).statusCode || 500;

 // Create response object without optional error property
const response: ApiResponse = {
    success: false,
    message: error.message || 'Internal Server Error',
  };
  
  // Only add error property if in development mode
  if (process.env.NODE_ENV === 'development' && err.stack) {
    response.error = err.stack;
  }
  
  res.status(statusCode).json(response);
};