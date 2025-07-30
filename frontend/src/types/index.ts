// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  error?: string
}

export interface PaginationData {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: PaginationData
}

// User Types
export interface User {
  id: string
  username: string
  email: string
  name: string
  organizationId: string
  isActive: boolean
  createdAt: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  name: string
  password: string
  organizationName: string
}

export interface AuthResponse extends ApiResponse {
  data: {
    user: User
    token: string
  }
}

// Contact Types
export interface Note {
  _id: string
  content: string
  type: 'call' | 'meeting' | 'email' | 'general'
  addedBy: string
  addedByName: string
  addedAt: string
  isPrivate: boolean
}

export interface Contact {
  _id: string
  organizationId: string
  name: string
  email?: string
  phone?: string
  notes: Note[]
  createdBy: string
  createdByName: string
  lastModifiedBy: string
  lastModifiedByName: string
  status: 'active' | 'inactive' | 'archived'
  createdAt: string
  updatedAt: string
}

export interface CreateContactData {
  name: string
  email?: string
  phone?: string
}

export interface UpdateContactData {
  name?: string
  email?: string
  phone?: string
}

export interface CreateNoteData {
  content: string
  type?: 'call' | 'meeting' | 'email' | 'general'
  isPrivate?: boolean
}

// Audit Log Types
export interface AuditLogChanges {
  old?: Record<string, any>
  new?: Record<string, any>
}

export interface AuditLogMetadata {
  ipAddress?: string
  userAgent?: string
  description?: string
}

export interface AuditLog {
  _id: string
  organizationId: string
  entityType: 'contact' | 'note' | 'user'
  entityId: string
  action: 'create' | 'update' | 'delete' | 'restore'
  changes?: AuditLogChanges
  performedBy: string
  performedByName: string
  metadata?: AuditLogMetadata
  timestamp: string
}

// Toast Types
export interface Toast {
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
}

// Form Validation Types
export interface ValidationErrors {
  [key: string]: string
}

// Store State Types
export interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
}

export interface ContactState {
  contacts: Contact[]
  currentContact: Contact | null
  loading: boolean
  pagination: PaginationData
}

export interface ToastState {
  toast: Toast | null
}