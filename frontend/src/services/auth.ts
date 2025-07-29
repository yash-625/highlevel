
  // =============================================================================
  // AUTH SERVICE
  // =============================================================================
  // File: frontend/src/services/auth.ts
  
  import { httpClient } from './http';
  import { ApiResponse, AuthResponse, RegisterRequest, LoginRequest, User } from '@/types/api';
  
  class AuthService {
    async register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
      return httpClient.post('/auth/register', data);
    }
  
    async login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
      return httpClient.post('/auth/login', data);
    }
  
    async getProfile(): Promise<ApiResponse<User>> {
      return httpClient.get('/auth/profile');
    }
  }
  
  export const authService = new AuthService();