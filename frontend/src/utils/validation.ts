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