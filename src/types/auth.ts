import { Request } from 'express';
import { IUser } from '../models/User';

// Registration request body
export interface RegisterRequest {
  username: string;
  email: string;
  name: string;
  password: string;
}

// Login request body
export interface LoginRequest {
  username: string;
  password: string;
}

// JWT payload
export interface JWTPayload {
  userId: string;
  username: string;
  email: string;
}

// Extended Request interface with user
export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

// API Response interfaces
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    username: string;
    email: string;
    name: string;
    createdAt: Date;
  };
  token: string;
}