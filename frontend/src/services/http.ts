// =============================================================================
  // HTTP CLIENT CONFIGURATION
  // =============================================================================
  // File: frontend/src/services/http.ts
  
  import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
  import { useAuthStore } from '@/stores/auth';
  
  class HttpClient {
    private client: AxiosInstance;
  
    constructor() {
      this.client = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      this.setupInterceptors();
    }
  
    private setupInterceptors(): void {
      // Request interceptor - Add auth token
      this.client.interceptors.request.use(
        (config) => {
          const authStore = useAuthStore();
          if (authStore.token) {
            config.headers.Authorization = `Bearer ${authStore.token}`;
          }
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );
  
      // Response interceptor - Handle errors
      this.client.interceptors.response.use(
        (response: AxiosResponse) => {
          return response;
        },
        (error: AxiosError) => {
          const authStore = useAuthStore();
          
          // Handle 401 errors - token expired or invalid
          if (error.response?.status === 401) {
            authStore.logout();
            window.location.href = '/login';
          }
  
          // Handle network errors
          if (!error.response) {
            console.error('Network error:', error.message);
            throw new Error('Network error. Please check your connection.');
          }
  
          // Return the error response for handling in components
          throw error;
        }
      );
    }
  
    // HTTP methods
    async get<T>(url: string, params?: any): Promise<T> {
      const response = await this.client.get(url, { params });
      return response.data;
    }
  
    async post<T>(url: string, data?: any): Promise<T> {
      const response = await this.client.post(url, data);
      return response.data;
    }
  
    async put<T>(url: string, data?: any): Promise<T> {
      const response = await this.client.put(url, data);
      return response.data;
    }
  
    async delete<T>(url: string): Promise<T> {
      const response = await this.client.delete(url);
      return response.data;
    }
  }
  
  export const httpClient = new HttpClient();