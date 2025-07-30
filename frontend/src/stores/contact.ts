import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiService } from '../services/api'
import { useToastStore } from './toast'
import type { 
  Contact, 
  CreateContactData, 
  UpdateContactData, 
  CreateNoteData,
  PaginationData,
  AuditLog
} from '../types'

interface AuditLogsResult {
  logs: AuditLog[]
  pagination: PaginationData
}

export const useContactStore = defineStore('contact', () => {
  const contacts = ref<Contact[]>([])
  const currentContact = ref<Contact | null>(null)
  const loading = ref<boolean>(false)
  const pagination = ref<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  })

  const toastStore = useToastStore()

  const loadContacts = async (page: number = 1): Promise<void> => {
    try {
      loading.value = true
      const response = await apiService.getContacts(page, pagination.value.limit)
      
      if (response.success && response.data) {
        contacts.value = response.data
        pagination.value = response.pagination
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load contacts'
      toastStore.showToast(errorMessage, 'error')
    } finally {
      loading.value = false
    }
  }

  const getContact = async (id: string): Promise<Contact> => {
    try {
      loading.value = true
      const response = await apiService.getContact(id)
      
      if (response.success && response.data) {
        currentContact.value = response.data
        return response.data
      }
      
      throw new Error(response.message || 'Failed to load contact')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load contact'
      toastStore.showToast(errorMessage, 'error')
      throw error
    } finally {
      loading.value = false
    }
  }

  const createContact = async (contactData: CreateContactData): Promise<Contact> => {
    try {
      loading.value = true
      const response = await apiService.createContact(contactData)
      
      if (response.success && response.data) {
        toastStore.showToast('Contact created successfully!', 'success')
        await loadContacts(pagination.value.page) // Refresh current page
        return response.data
      }
      
      throw new Error(response.message || 'Failed to create contact')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create contact'
      toastStore.showToast(errorMessage, 'error')
      throw error
    } finally {
      loading.value = false
    }
  }

  const updateContact = async (id: string, contactData: UpdateContactData): Promise<Contact> => {
    try {
      loading.value = true
      const response = await apiService.updateContact(id, contactData)
      
      if (response.success && response.data) {
        currentContact.value = response.data
        toastStore.showToast('Contact updated successfully!', 'success')
        
        // Update contact in the list if it exists
        const index = contacts.value.findIndex(c => c._id === id)
        if (index !== -1) {
          contacts.value[index] = response.data
        }
        
        return response.data
      }
      
      throw new Error(response.message || 'Failed to update contact')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update contact'
      toastStore.showToast(errorMessage, 'error')
      throw error
    } finally {
      loading.value = false
    }
  }

  const deleteContact = async (id: string): Promise<boolean> => {
    try {
      loading.value = true
      const response = await apiService.deleteContact(id)
      
      if (response.success) {
        toastStore.showToast('Contact deleted successfully!', 'success')
        await loadContacts(pagination.value.page) // Refresh current page
        return true
      }
      
      throw new Error(response.message || 'Failed to delete contact')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete contact'
      toastStore.showToast(errorMessage, 'error')
      throw error
    } finally {
      loading.value = false
    }
  }

  const addNote = async (contactId: string, noteData: CreateNoteData): Promise<Contact> => {
    try {
      const response = await apiService.addNote(contactId, noteData)
      
      if (response.success && response.data) {
        currentContact.value = response.data
        toastStore.showToast('Note added successfully!', 'success')
        return response.data
      }
      
      throw new Error(response.message || 'Failed to add note')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add note'
      toastStore.showToast(errorMessage, 'error')
      throw error
    }
  }

  const getAuditLogs = async (
    contactId: string, 
    page: number = 1, 
    limit: number = 20
  ): Promise<AuditLogsResult> => {
    try {
      const response = await apiService.getAuditLogs(contactId, page, limit)
      
      if (response.success && response.data) {
        return {
          logs: response.data,
          pagination: response.pagination
        }
      }
      
      throw new Error(response.message || 'Failed to load audit logs')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load audit logs'
      toastStore.showToast(errorMessage, 'error')
      throw error
    }
  }

  return {
    contacts,
    currentContact,
    loading,
    pagination,
    loadContacts,
    getContact,
    createContact,
    updateContact,
    deleteContact,
    addNote,
    getAuditLogs
  }
})