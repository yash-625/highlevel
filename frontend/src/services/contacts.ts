
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