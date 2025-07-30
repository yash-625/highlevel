import type {
  ApiResponse,
  PaginatedResponse,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  User,
  Contact,
  CreateContactData,
  UpdateContactData,
  CreateNoteData,
  AuditLog
} from '../types'

class ApiService {
  private baseURL: string
  private token: string | null

  constructor() {
    this.baseURL = 'http://localhost:3000/api'
    this.token = localStorage.getItem('auth_token')
  }

  setToken(token: string): void {
    this.token = token
    localStorage.setItem('auth_token', token)
  }

  removeToken(): void {
    this.token = null
    localStorage.removeItem('auth_token')
  }

  private async request<T = any>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }
      
      return data
    } catch (error) {
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error. Please check your connection and try again.')
      }
      throw error
    }
  }

  // Auth methods
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    return await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async getProfile(): Promise<ApiResponse<User>> {
    return await this.request<ApiResponse<User>>('/auth/profile')
  }

  // Contact methods
  async getContacts(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Contact>> {
    return await this.request<PaginatedResponse<Contact>>(`/contacts?page=${page}&limit=${limit}`)
  }

  async getContact(id: string): Promise<ApiResponse<Contact>> {
    return await this.request<ApiResponse<Contact>>(`/contacts/${id}`)
  }

  async createContact(contactData: CreateContactData): Promise<ApiResponse<Contact>> {
    return await this.request<ApiResponse<Contact>>('/contacts', {
      method: 'POST',
      body: JSON.stringify(contactData),
    })
  }

  async updateContact(id: string, contactData: UpdateContactData): Promise<ApiResponse<Contact>> {
    return await this.request<ApiResponse<Contact>>(`/contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(contactData),
    })
  }

  async deleteContact(id: string): Promise<ApiResponse> {
    return await this.request<ApiResponse>(`/contacts/${id}`, {
      method: 'DELETE',
    })
  }

  async addNote(contactId: string, noteData: CreateNoteData): Promise<ApiResponse<Contact>> {
    return await this.request<ApiResponse<Contact>>(`/contacts/${contactId}/notes`, {
      method: 'POST',
      body: JSON.stringify(noteData),
    })
  }

  async getAuditLogs(
    contactId: string, 
    page: number = 1, 
    limit: number = 20
  ): Promise<PaginatedResponse<AuditLog>> {
    return await this.request<PaginatedResponse<AuditLog>>(
      `/contacts/${contactId}/audit-logs?page=${page}&limit=${limit}`
    )
  }
}

export const apiService = new ApiService()