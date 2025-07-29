
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