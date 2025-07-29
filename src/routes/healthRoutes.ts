import { Router, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { ApiResponse } from '../types/auth';

const router = Router();

interface HealthResponse {
  status: string;
  timestamp: string;
  uptime: number;
  database: {
    status: string;
    connected: boolean;
    responseTime?: number;
  };
  environment: string;
  version: string;
}

// @route   GET /api/health
// @desc    Health check endpoint with database status
// @access  Public
router.get('/', async (
  _req: Request,
  res: Response<ApiResponse<HealthResponse>>,
  next: NextFunction
): Promise<void> => {
  try {
    const startTime = Date.now();
    
    // Check database connection
    let dbStatus = 'disconnected';
    let dbConnected = false;
    let responseTime: number | undefined;

    try {
      // Check MongoDB connection status
      const dbState = mongoose.connection.readyState;
      
      if (dbState === 1) {
        // Test database connectivity with a simple ping
        await mongoose.connection.db?.admin().ping();
        dbStatus = 'connected';
        dbConnected = true;
        responseTime = Date.now() - startTime;
      } else {
        dbStatus = 'disconnected';
        dbConnected = false;
      }
    } catch (dbError) {
      console.error('Database health check failed:', dbError);
      dbStatus = 'error';
      dbConnected = false;
    }

    // Determine overall status
    const overallStatus = dbConnected ? 'healthy' : 'unhealthy';
    const statusCode = dbConnected ? 200 : 503;

    res.status(statusCode).json({
      success: dbConnected,
      message: `Service is ${overallStatus}`,
      data: {
        status: overallStatus,
        timestamp: new Date().toISOString(),
        uptime: Math.floor(process.uptime()),
        database: {
          status: dbStatus,
          connected: dbConnected,
          ...(responseTime && { responseTime }),
        },
        environment: process.env.NODE_ENV || 'development',
        version: '1.0.0',
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;