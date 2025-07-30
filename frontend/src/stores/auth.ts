import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiService } from '../services/api'
import { useToastStore } from './toast'
import type { User, LoginCredentials, RegisterData } from '../types'

interface AuthResult {
  success: boolean
  error?: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const loading = ref<boolean>(false)

  const toastStore = useToastStore()

  const isAuthenticated = computed<boolean>(() => !!token.value && !!user.value)

  const setToken = (newToken: string): void => {
    token.value = newToken
    localStorage.setItem('auth_token', newToken)
    apiService.setToken(newToken)
  }

  const clearAuth = (): void => {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
    apiService.removeToken()
  }

  const login = async (credentials: LoginCredentials): Promise<AuthResult> => {
    try {
      loading.value = true
      const response = await apiService.login(credentials)
      
      if (response.success) {
        user.value = response.data.user
        setToken(response.data.token)
        toastStore.showToast('Login successful!', 'success')
        return { success: true }
      }
      
      return { success: false, error: response.message }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      toastStore.showToast(errorMessage, 'error')
      return { success: false, error: errorMessage }
    } finally {
      loading.value = false
    }
  }

  const register = async (userData: RegisterData): Promise<AuthResult> => {
    try {
      loading.value = true
      const response = await apiService.register(userData)
      
      if (response.success) {
        user.value = response.data.user
        setToken(response.data.token)
        toastStore.showToast('Registration successful!', 'success')
        return { success: true }
      }
      
      return { success: false, error: response.message }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed'
      toastStore.showToast(errorMessage, 'error')
      return { success: false, error: errorMessage }
    } finally {
      loading.value = false
    }
  }

  const logout = (): void => {
    clearAuth()
    toastStore.showToast('Logged out successfully', 'success')
  }

  const getProfile = async (): Promise<void> => {
    try {
      const response = await apiService.getProfile()
      if (response.success && response.data) {
        user.value = response.data
      }
    } catch (error) {
      // Token might be invalid, clear auth
      clearAuth()
      throw error
    }
  }

  // Initialize auth state if token exists
  const initializeAuth = async (): Promise<void> => {
    if (token.value) {
      apiService.setToken(token.value)
      try {
        await getProfile()
      } catch (error) {
        clearAuth()
      }
    }
  }

  return {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    getProfile,
    initializeAuth
  }
})