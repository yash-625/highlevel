import { defineStore } from 'pinia';
import { ref, computed, readonly } from 'vue';
import { contactService } from '@/services/contacts';
import { handleApiError } from '@/utils/error';
import type { 
  Contact, 
  CreateContactRequest, 
  AddNoteRequest, 
  ContactListParams 
} from '@/types/api';

export const useContactsStore = defineStore('contacts', () => {
  // State
  const contacts = ref<Contact[]>([]);
  const currentContact = ref<Contact | null>(null);
  const loading = ref(false);
  const creating = ref(false);
  const updating = ref(false);
  const deleting = ref(false);
  const error = ref<string | null>(null);
  
  // Pagination state
  const pagination = ref({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });

  // Filter state
  const filters = ref<ContactListParams>({
    page: 1,
    limit: 20,
    search: '',
    status: 'active',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  // Getters
  const totalContacts = computed(() => pagination.value.total);
  const hasContacts = computed(() => contacts.value.length > 0);
  const filteredContactsCount = computed(() => contacts.value.length);

  // Actions
  async function fetchContacts(params: ContactListParams = {}): Promise<void> {
    loading.value = true;
    error.value = null;

    try {
      const searchParams = { ...filters.value, ...params };
      const response = await contactService.listContacts(searchParams);

      if (response.success && response.data) {
        contacts.value = response.data;
        
        if (response.pagination) {
          pagination.value = response.pagination;
        }
      }
    } catch (err) {
      const errorInfo = handleApiError(err);
      error.value = errorInfo.message;
      contacts.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function fetchContact(id: string): Promise<Contact | null> {
    loading.value = true;
    error.value = null;

    try {
      const response = await contactService.getContact(id);

      if (response.success && response.data) {
        currentContact.value = response.data;
        return response.data;
      }
      
      throw new Error(response.message || 'Contact not found');
    } catch (err) {
      const errorInfo = handleApiError(err);
      error.value = errorInfo.message;
      currentContact.value = null;
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function createContact(data: CreateContactRequest): Promise<Contact | null> {
    creating.value = true;
    error.value = null;

    try {
      const response = await contactService.createContact(data);

      if (response.success && response.data) {
        // Add to the beginning of the list
        contacts.value.unshift(response.data);
        pagination.value.total += 1;
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to create contact');
    } catch (err) {
      const errorInfo = handleApiError(err);
      error.value = errorInfo.message;
      return null;
    } finally {
      creating.value = false;
    }
  }

  async function updateContact(id: string, data: Partial<CreateContactRequest>): Promise<Contact | null> {
    updating.value = true;
    error.value = null;

    try {
      const response = await contactService.updateContact(id, data);

      if (response.success && response.data) {
        // Update in the list
        const index = contacts.value.findIndex(c => c._id === id);
        if (index !== -1) {
          contacts.value[index] = response.data;
        }
        
        // Update current contact if it's the same
        if (currentContact.value?._id === id) {
          currentContact.value = response.data;
        }
        
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to update contact');
    } catch (err) {
      const errorInfo = handleApiError(err);
      error.value = errorInfo.message;
      return null;
    } finally {
      updating.value = false;
    }
  }

  async function deleteContact(id: string): Promise<boolean> {
    deleting.value = true;
    error.value = null;

    try {
      const response = await contactService.deleteContact(id);

      if (response.success) {
        // Remove from the list
        contacts.value = contacts.value.filter(c => c._id !== id);
        pagination.value.total -= 1;
        
        // Clear current contact if it's the deleted one
        if (currentContact.value?._id === id) {
          currentContact.value = null;
        }
        
        return true;
      }
      
      throw new Error(response.message || 'Failed to delete contact');
    } catch (err) {
      const errorInfo = handleApiError(err);
      error.value = errorInfo.message;
      return false;
    } finally {
      deleting.value = false;
    }
  }

  async function addNoteToContact(contactId: string, noteData: AddNoteRequest): Promise<boolean> {
    error.value = null;

    try {
      const response = await contactService.addNote(contactId, noteData);

      if (response.success && response.data?.contact) {
        // Update the contact in the list
        const index = contacts.value.findIndex(c => c._id === contactId);
        if (index !== -1) {
          contacts.value[index] = response.data.contact;
        }
        
        // Update current contact if it's the same
        if (currentContact.value?._id === contactId) {
          currentContact.value = response.data.contact;
        }
        
        return true;
      }
      
      throw new Error(response.message || 'Failed to add note');
    } catch (err) {
      const errorInfo = handleApiError(err);
      error.value = errorInfo.message;
      return false;
    }
  }

  function setFilters(newFilters: Partial<ContactListParams>): void {
    filters.value = { ...filters.value, ...newFilters };
  }

  function setCurrentPage(page: number): void {
    filters.value.page = page;
  }

  function setSearch(search: string): void {
    filters.value.search = search;
    filters.value.page = 1; // Reset to first page when searching
  }

  function clearCurrentContact(): void {
    currentContact.value = null;
  }

  function clearError(): void {
    error.value = null;
  }

  function resetFilters(): void {
    filters.value = {
      page: 1,
      limit: 20,
      search: '',
      status: 'active',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
  }

  return {
    // State
    contacts: readonly(contacts),
    currentContact: readonly(currentContact),
    loading: readonly(loading),
    creating: readonly(creating),
    updating: readonly(updating),
    deleting: readonly(deleting),
    error: readonly(error),
    pagination: readonly(pagination),
    filters: readonly(filters),
    
    // Getters
    totalContacts,
    hasContacts,
    filteredContactsCount,
    
    // Actions
    fetchContacts,
    fetchContact,
    createContact,
    updateContact,
    deleteContact,
    addNoteToContact,
    setFilters,
    setCurrentPage,
    setSearch,
    clearCurrentContact,
    clearError,
    resetFilters
  };
}); 