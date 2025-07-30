<template>
  <div>
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-bold">Contacts</h1>
        <p class="text-base-content/70 mt-1">Manage your organization's contacts</p>
      </div>
      <button 
        class="btn btn-primary gap-2"
        @click="showCreateModal = true"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        Add Contact
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="contactStore.loading && !contacts.length" class="flex justify-center items-center py-12">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <!-- Contacts Table -->
    <div v-else class="card bg-base-100 shadow-xl">
      <div class="card-body p-0">
        <div class="overflow-x-auto">
          <table class="table table-zebra">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Created</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="contact in contacts" :key="contact._id" class="hover">
                <td>
                  <div class="flex items-center gap-3">
                    <div class="avatar placeholder">
                      <div class="bg-neutral text-neutral-content rounded-full w-8">
                        <span class="text-xs">{{ getContactInitials(contact.name) }}</span>
                      </div>
                    </div>
                    <div class="font-semibold">{{ contact.name }}</div>
                  </div>
                </td>
                <td>
                  <span v-if="contact.email">{{ contact.email }}</span>
                  <span v-else class="text-base-content/50">-</span>
                </td>
                <td>
                  <span v-if="contact.phone">{{ contact.phone }}</span>
                  <span v-else class="text-base-content/50">-</span>
                </td>
                <td>
                  <span class="text-sm">{{ formatDate(contact.createdAt) }}</span>
                  <div class="text-xs text-base-content/50">by {{ contact.createdByName }}</div>
                </td>
                <td>
                  <div class="badge badge-outline">
                    {{ contact.notes?.length || 0 }} notes
                  </div>
                </td>
                <td>
                  <button 
                    class="btn btn-sm btn-outline"
                    @click="viewContact(contact)"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="!contacts.length && !contactStore.loading" class="text-center py-12">
          <div class="text-6xl mb-4">👥</div>
          <h3 class="text-xl font-semibold mb-2">No contacts yet</h3>
          <p class="text-base-content/70 mb-4">Get started by adding your first contact</p>
          <button 
            class="btn btn-primary"
            @click="showCreateModal = true"
          >
            Add Contact
          </button>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="contacts.length > 0" class="flex justify-center items-center gap-2 mt-6">
      <div class="join">
        <button 
          class="join-item btn btn-sm"
          :disabled="!pagination.hasPrevPage || contactStore.loading"
          @click="handlePageChange(pagination.page - 1)"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        
        <button class="join-item btn btn-sm btn-active">
          Page {{ pagination.page }} of {{ pagination.totalPages }}
        </button>
        
        <button 
          class="join-item btn btn-sm"
          :disabled="!pagination.hasNextPage || contactStore.loading"
          @click="handlePageChange(pagination.page + 1)"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>
      
      <div class="text-sm text-base-content/70 ml-4">
        Showing {{ contacts.length }} of {{ pagination.total }} contacts
      </div>
    </div>

    <!-- Create Contact Modal -->
    <div v-if="showCreateModal" class="modal modal-open">
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-4">Create New Contact</h3>
        
        <form @submit.prevent="handleCreateContact">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Name *</span>
            </label>
            <input
              v-model="newContact.name"
              type="text"
              placeholder="Contact name"
              class="input input-bordered"
              :class="{ 'input-error': errors.name }"
              required
            />
            <label v-if="errors.name" class="label">
              <span class="label-text-alt text-error">{{ errors.name }}</span>
            </label>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Email</span>
            </label>
            <input
              v-model="newContact.email"
              type="email"
              placeholder="contact@example.com"
              class="input input-bordered"
              :class="{ 'input-error': errors.email }"
            />
            <label v-if="errors.email" class="label">
              <span class="label-text-alt text-error">{{ errors.email }}</span>
            </label>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Phone</span>
            </label>
            <input
              v-model="newContact.phone"
              type="tel"
              placeholder="+1-555-123-4567"
              class="input input-bordered"
              :class="{ 'input-error': errors.phone }"
            />
            <label v-if="errors.phone" class="label">
              <span class="label-text-alt text-error">{{ errors.phone }}</span>
            </label>
          </div>

          <div class="modal-action">
            <button 
              type="submit" 
              class="btn btn-primary"
              :class="{ 'loading': contactStore.loading }"
              :disabled="contactStore.loading"
            >
              <span v-if="!contactStore.loading">Create Contact</span>
            </button>
            <button 
              type="button" 
              class="btn"
              @click="closeCreateModal"
              :disabled="contactStore.loading"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useContactStore } from '../stores/contact'

const router = useRouter()
const contactStore = useContactStore()

const showCreateModal = ref(false)
const newContact = reactive({
  name: '',
  email: '',
  phone: ''
})
const errors = ref({})

const contacts = computed(() => contactStore.contacts)
const pagination = computed(() => contactStore.pagination)

onMounted(() => {
  contactStore.loadContacts()
})

const getContactInitials = (name) => {
  const names = name.split(' ')
  if (names.length >= 2) {
    return names[0][0] + names[1][0]
  }
  return names[0][0] || 'C'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const viewContact = (contact) => {
  router.push(`/contact/${contact._id}`)
}

const handlePageChange = (newPage) => {
  contactStore.loadContacts(newPage)
}

const validateCreateForm = () => {
  errors.value = {}
  
  if (!newContact.name.trim()) {
    errors.value.name = 'Name is required'
  } else if (newContact.name.length < 2) {
    errors.value.name = 'Name must be at least 2 characters'
  }
  
  if (newContact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newContact.email)) {
    errors.value.email = 'Please enter a valid email address'
  }
  
  if (newContact.phone && !/^[\+]?[\d\s\-\(\)]{10,}$/.test(newContact.phone)) {
    errors.value.phone = 'Please enter a valid phone number'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleCreateContact = async () => {
  if (!validateCreateForm()) {
    return
  }

  try {
    await contactStore.createContact(newContact)
    closeCreateModal()
  } catch (error) {
    // Error is handled in the store
  }
}

const closeCreateModal = () => {
  showCreateModal.value = false
  newContact.name = ''
  newContact.email = ''
  newContact.phone = ''
  errors.value = {}
}
</script>