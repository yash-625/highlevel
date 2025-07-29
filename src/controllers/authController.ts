import { Request, Response, NextFunction } from 'express';
import { RegisterRequest, LoginRequest, ApiResponse, AuthResponse, AuthenticatedRequest } from '../types/auth';
import authService from '../services/authService';

class AuthController {
  // Register new user
  async register(
    req: Request<{}, ApiResponse<AuthResponse>, RegisterRequest>,
    res: Response<ApiResponse<AuthResponse>>,
    next: NextFunction
  ): Promise<void> {
    try {
      const userData: RegisterRequest = req.body;
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

  // Login user
  async login(
    req: Request<{}, ApiResponse<AuthResponse>, LoginRequest>,
    res: Response<ApiResponse<AuthResponse>>,
    next: NextFunction
  ): Promise<void> {
    try {
      const loginData: LoginRequest = req.body;
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

  // Get user profile (protected route)
  async getProfile(
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
          error: 'User information missing from request',
        });
        return;
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
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();