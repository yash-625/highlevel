import { defineStore } from 'pinia';
import { ref, computed, readonly } from 'vue';
import { authService } from '@/services/auth';
import { tokenStorage, userStorage } from '@/utils/storage';
import { handleApiError } from '@/utils/error';
import type { User, RegisterRequest, LoginRequest } from '@/types/api';

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const isAuthenticated = computed(() => !!user.value && !!token.value);
  const organizationName = computed(() => user.value?.organizationName || '');
  const userName = computed(() => user.value?.name || '');

  // Actions
  async function register(data: RegisterRequest): Promise<boolean> {
    loading.value = true;
    error.value = null;

    try {
      const response = await authService.register(data);
      
      if (response.success && response.data) {
        setAuthData(response.data.user, response.data.token);
        return true;
      }
      
      throw new Error(response.message || 'Registration failed');
    } catch (err) {
      const errorInfo = handleApiError(err);
      error.value = errorInfo.message;
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function login(data: LoginRequest): Promise<boolean> {
    loading.value = true;
    error.value = null;

    try {
      const response = await authService.login(data);
      
      if (response.success && response.data) {
        setAuthData(response.data.user, response.data.token);
        return true;
      }
      
      throw new Error(response.message || 'Login failed');
    } catch (err) {
      const errorInfo = handleApiError(err);
      error.value = errorInfo.message;
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function getProfile(): Promise<void> {
    if (!token.value) return;

    try {
      const response = await authService.getProfile();
      
      if (response.success && response.data) {
        user.value = response.data;
        userStorage.set(response.data);
      }
    } catch (err) {
      console.error('Failed to get profile:', err);
      // Don't logout on profile fetch failure, just log the error
    }
  }

  function logout(): void {
    user.value = null;
    token.value = null;
    error.value = null;
    tokenStorage.remove();
    userStorage.remove();
  }

  function setAuthData(userData: User, authToken: string): void {
    user.value = userData;
    token.value = authToken;
    tokenStorage.set(authToken);
    userStorage.set(userData);
  }

  function initializeFromStorage(): void {
    const storedToken = tokenStorage.get();
    const storedUser = userStorage.get();

    if (storedToken && storedUser) {
      token.value = storedToken;
      user.value = storedUser;
      // Optionally refresh profile from server
      getProfile();
    }
  }

  function clearError(): void {
    error.value = null;
  }

  return {
    // State
    user: readonly(user),
    token: readonly(token),
    loading: readonly(loading),
    error: readonly(error),
    
    // Getters
    isAuthenticated,
    organizationName,
    userName,
    
    // Actions
    register,
    login,
    logout,
    getProfile,
    initializeFromStorage,
    clearError
  };
}); 