import { Request } from 'express';
import { IUser } from '../models/User';

// Registration request body
export interface RegisterRequest {
  username: string;
  email: string;
  name: string;
  password: string;
  organizationName: string; // New field for organization
}

// Login request body
export interface LoginRequest {
  username: string;
  password: string;
}

// Updated JWT payload with organizationId
export interface JWTPayload {
  userId: string;
  organizationId: string;
  username: string;
  email: string;
  isActive: boolean;
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
  pagination?: any
}

export interface AuthResponse {
  user: {
    id: string;
    username: string;
    email: string;
    name: string;
    organizationId: string;
    organizationName: string;
    isActive: boolean;
    createdAt: Date;
  };
  token: string;
}

// Contact API Types
export interface CreateContactRequest {
  name: string;
  email?: string;
  phone?: string;
}

export interface AddNoteRequest {
  content: string;
  type?: 'call' | 'meeting' | 'email' | 'general';
  isPrivate?: boolean;
}