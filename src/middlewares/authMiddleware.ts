
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, ApiResponse } from '../types/auth';
import { verifyToken } from '../utils/jwt';
import User from '../models/User';

/**
 * Multi-tenant authentication middleware
 */
export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
        error: 'Authorization header missing or invalid format',
      });
      return;
    }

    const token = authHeader.substring(7);
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

    // Find user with organization validation
    const user = await User.findOne({
      _id: decoded.userId,
      organizationId: decoded.organizationId,
      isActive: true
    })
    .populate('organizationId', 'name status')
    .select('-password');

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Access denied. User not found or inactive.',
        error: 'User associated with token does not exist or is inactive',
      });
      return;
    }

    // Check organization status
    const organization = user.organizationId as any;
    if (!organization || organization.status !== 'active') {
      res.status(403).json({
        success: false,
        message: 'Access denied. Organization is not active.',
        error: 'Organization associated with user is not active',
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