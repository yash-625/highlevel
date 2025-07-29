import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest, ApiResponse, RegisterRequest, LoginRequest } from '../types/auth';
import authService from '../services/authService';

class AuthController {
  /**
   * Register a new user with organization
   * POST /api/auth/register
   */
  async register(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const userData: RegisterRequest = {
        username: req.body.username,
        email: req.body.email,
        name: req.body.name,
        password: req.body.password,
        organizationName: req.body.organizationName
      };

      const result = await authService.registerUser(userData);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login user
   * POST /api/auth/login
   */
  async login(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const loginData: LoginRequest = {
        username: req.body.username,
        password: req.body.password,
      };

      const result = await authService.loginUser(loginData);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user profile
   * GET /api/auth/profile
   */
  async getProfile(req: AuthenticatedRequest, res: Response<ApiResponse>, next: NextFunction): Promise<void | any>  {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated',
          error: 'No user found in request',
        });
      }

      const user = await authService.getUserProfile(req.user._id.toString());

      res.status(200).json({
        success: true,
        message: 'Profile retrieved successfully',
        data: {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          name: user.name,
          organizationId: user.organizationId.toString(),
          isActive: user.isActive,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();