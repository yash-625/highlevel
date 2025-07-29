import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, ApiResponse } from '../types/auth';
import { verifyToken } from '../utils/jwt';
import User from '../models/User';

// Middleware to authenticate JWT token
export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    // Check if authorization header exists and starts with 'Bearer '
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
        error: 'Authorization header missing or invalid format',
      });
      return;
    }

    // Extract token from header
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access denied. Token is empty.',
        error: 'Token not found in authorization header',
      });
      return;
    }

    // Verify token
    const decoded = verifyToken(token);

    // Find user by ID from token
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Access denied. User not found.',
        error: 'User associated with token does not exist',
      });
      return;
    }

    // Attach user to request object
    req.user = user;
    next();

  } catch (error) {
    console.error('Authentication error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Token verification failed';

    res.status(401).json({
      success: false,
      message: 'Access denied. Invalid token.',
      error: errorMessage,
    });
  }
};