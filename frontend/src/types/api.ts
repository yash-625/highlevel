// =============================================================================
// API TYPES & INTERFACES
// =============================================================================
// File: frontend/src/types/api.ts

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }
  
  export interface User {
    id: string;
    username: string;
    email: string;
    name: string;
    organizationId: string;
    organizationName: string;
    isActive: boolean;
    createdAt: string;
  }
  
  export interface AuthResponse {
    user: User;
    token: string;
  }
  
  export interface RegisterRequest {
    username: string;
    email: string;
    name: string;
    password: string;
    organizationName: string;
  }
  
  export interface LoginRequest {
    username: string;
    password: string;
  }
  
  export interface Contact {
    _id: string;
    name: string;
    email?: string;
    phone?: string;
    organizationId: string;
    createdBy: string;
    createdByName: string;
    lastModifiedBy?: string;
    lastModifiedByName?: string;
    status: 'active' | 'inactive' | 'archived';
    notes: Note[];
    noteCount?: number;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Note {
    _id: string;
    content: string;
    type: 'call' | 'meeting' | 'email' | 'general';
    addedBy: string;
    addedByName: string;
    addedAt: string;
    isPrivate: boolean;
  }
  
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
  
  export interface ContactListParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }
  
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
  
  // =============================================================================
  // CONTACT SERVICE
  // =============================================================================
  // File: frontend/src/services/contacts.ts
  
  import { httpClient } from './http';
  import { 
    ApiResponse, 
    Contact, 
    CreateContactRequest, 
    AddNoteRequest, 
    ContactListParams 
  } from '@/types/api';
  
  class ContactService {
    async createContact(data: CreateContactRequest): Promise<ApiResponse<Contact>> {
      return httpClient.post('/v1/contacts', data);
    }
  
    async getContact(id: string): Promise<ApiResponse<Contact>> {
      return httpClient.get(`/v1/contacts/${id}`);
    }
  
    async updateContact(id: string, data: Partial<CreateContactRequest>): Promise<ApiResponse<Contact>> {
      return httpClient.put(`/v1/contacts/${id}`, data);
    }
  
    async deleteContact(id: string): Promise<ApiResponse<{ deletedId: string; deletedAt: string }>> {
      return httpClient.delete(`/v1/contacts/${id}`);
    }
  
    async listContacts(params: ContactListParams = {}): Promise<ApiResponse<Contact[]>> {
      return httpClient.get('/v1/contacts', params);
    }
  
    async addNote(contactId: string, data: AddNoteRequest): Promise<ApiResponse<{ contact: Contact }>> {
      return httpClient.post(`/v1/contacts/${contactId}/notes`, data);
    }
  
    async getContactAuditLogs(contactId: string, params: { page?: number; limit?: number } = {}) {
      return httpClient.get(`/v1/contacts/${contactId}/audit-logs`, params);
    }
  }
  
  export const contactService = new ContactService();
  
  // =============================================================================
  // ERROR HANDLING UTILITIES
  // =============================================================================
  // File: frontend/src/utils/error.ts
  
  import { AxiosError } from 'axios';
  import { ApiResponse } from '@/types/api';
  
  export interface ErrorInfo {
    message: string;
    code?: string;
    details?: any;
  }
  
  export function handleApiError(error: unknown): ErrorInfo {
    if (error instanceof AxiosError) {
      const response = error.response?.data as ApiResponse;
      
      return {
        message: response?.message || error.message || 'An unexpected error occurred',
        code: response?.error || 'UNKNOWN_ERROR',
        details: response?.data
      };
    }
  
    if (error instanceof Error) {
      return {
        message: error.message,
        code: 'CLIENT_ERROR'
      };
    }
  
    return {
      message: 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR'
    };
  }
  
  export function getValidationErrors(error: AxiosError): Record<string, string> {
    const response = error.response?.data as ApiResponse;
    const errors: Record<string, string> = {};
  
    if (response?.data && Array.isArray(response.data)) {
      response.data.forEach((err: any) => {
        if (err.field && err.message) {
          errors[err.field] = err.message;
        }
      });
    }
  
    return errors;
  }
  
  // =============================================================================
  // LOCAL STORAGE UTILITIES
  // =============================================================================
  // File: frontend/src/utils/storage.ts
  
  export class Storage {
    static get(key: string): string | null {
      try {
        return localStorage.getItem(key);
      } catch (error) {
        console.error('Error getting item from localStorage:', error);
        return null;
      }
    }
  
    static set(key: string, value: string): void {
      try {
        localStorage.setItem(key, value);
      } catch (error) {
        console.error('Error setting item in localStorage:', error);
      }
    }
  
    static remove(key: string): void {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error('Error removing item from localStorage:', error);
      }
    }
  
    static clear(): void {
      try {
        localStorage.clear();
      } catch (error) {
        console.error('Error clearing localStorage:', error);
      }
    }
  }
  
  // Token management
  export const TOKEN_KEY = 'contact_management_token';
  export const USER_KEY = 'contact_management_user';
  
  export const tokenStorage = {
    get: () => Storage.get(TOKEN_KEY),
    set: (token: string) => Storage.set(TOKEN_KEY, token),
    remove: () => Storage.remove(TOKEN_KEY)
  };
  
  export const userStorage = {
    get: (): User | null => {
      const user = Storage.get(USER_KEY);
      return user ? JSON.parse(user) : null;
    },
    set: (user: User) => Storage.set(USER_KEY, JSON.stringify(user)),
    remove: () => Storage.remove(USER_KEY)
  };
  
  // =============================================================================
  // DATE & TIME UTILITIES
  // =============================================================================
  // File: frontend/src/utils/date.ts
  
  export function formatDate(date: string | Date): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
  
  export function formatDateTime(date: string | Date): string {
    const d = new Date(date);
    return d.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  export function formatRelativeTime(date: string | Date): string {
    const d = new Date(date);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);
  
    if (diffInSeconds < 60) {
      return 'Just now';
    }
  
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    }
  
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }
  
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  
    return formatDate(date);
  }
  
  // =============================================================================
  // VALIDATION UTILITIES
  // =============================================================================
  // File: frontend/src/utils/validation.ts
  
  export const validationRules = {
    required: (value: any) => !!value || 'This field is required',
    
    email: (value: string) => {
      if (!value) return true; // Optional field
      const pattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      return pattern.test(value) || 'Please enter a valid email address';
    },
    
    minLength: (min: number) => (value: string) => {
      return !value || value.length >= min || `Must be at least ${min} characters`;
    },
    
    maxLength: (max: number) => (value: string) => {
      return !value || value.length <= max || `Must not exceed ${max} characters`;
    },
    
    phone: (value: string) => {
      if (!value) return true; // Optional field
      const pattern = /^[\+]?[\d\s\-\(\)]{10,}$/;
      return pattern.test(value) || 'Please enter a valid phone number';
    },
    
    username: (value: string) => {
      if (!value) return 'Username is required';
      const pattern = /^[a-zA-Z0-9_]+$/;
      return pattern.test(value) || 'Username can only contain letters, numbers, and underscores';
    }
  };
  
  export function validateForm(data: Record<string, any>, rules: Record<string, Function[]>): Record<string, string> {
    const errors: Record<string, string> = {};
  
    for (const [field, fieldRules] of Object.entries(rules)) {
      const value = data[field];
      
      for (const rule of fieldRules) {
        const result = rule(value);
        if (result !== true) {
          errors[field] = result;
          break; // Stop at first error for this field
        }
      }
    }
  
    return errors;
  }