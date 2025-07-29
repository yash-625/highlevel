
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