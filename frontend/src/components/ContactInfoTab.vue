<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Contact Information Card -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <div class="flex justify-between items-center mb-4">
          <h2 class="card-title">Contact Information</h2>
          <div class="flex gap-2">
            <button 
              v-if="!isEditing"
              class="btn btn-sm btn-outline gap-2"
              @click="startEditing"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              Edit
            </button>
            <template v-else>
              <button 
                class="btn btn-sm btn-success gap-2"
                @click="saveContact"
                :disabled="contactStore.loading"
                :class="{ 'loading': contactStore.loading }"
              >
                <svg v-if="!contactStore.loading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Save
              </button>
              <button 
                class="btn btn-sm btn-outline gap-2"
                @click="cancelEditing"
                :disabled="contactStore.loading"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                Cancel
              </button>
            </template>
          </div>
        </div>

        <div class="space-y-4">
          <!-- Name Field -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold">Name</span>
            </label>
            <div v-if="!isEditing" class="flex items-center gap-2 p-3 bg-base-200 rounded-lg">
              <svg class="w-5 h-5 text-base-content/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <span>{{ contact.name }}</span>
            </div>
            <input
              v-else
              v-model="editForm.name"
              type="text"
              class="input input-bordered"
              :class="{ 'input-error': errors.name }"
              placeholder="Contact name"
            />
            <label v-if="errors.name" class="label">
              <span class="label-text-alt text-error">{{ errors.name }}</span>
            </label>
          </div>

          <!-- Email Field -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold">Email</span>
            </label>
            <div v-if="!isEditing" class="flex items-center gap-2 p-3 bg-base-200 rounded-lg">
              <svg class="w-5 h-5 text-base-content/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              <span>{{ contact.email || 'No email provided' }}</span>
            </div>
            <input
              v-else
              v-model="editForm.email"
              type="email"
              class="input input-bordered"
              :class="{ 'input-error': errors.email }"
              placeholder="contact@example.com"
            />
            <label v-if="errors.email" class="label">
              <span class="label-text-alt text-error">{{ errors.email }}</span>
            </label>
          </div>

          <!-- Phone Field -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold">Phone</span>
            </label>
            <div v-if="!isEditing" class="flex items-center gap-2 p-3 bg-base-200 rounded-lg">
              <svg class="w-5 h-5 text-base-content/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
              <span>{{ contact.phone || 'No phone provided' }}</span>
            </div>
            <input
              v-else
              v-model="editForm.phone"
              type="tel"
              class="input input-bordered"
              :class="{ 'input-error': errors.phone }"
              placeholder="+1-555-123-4567"
            />
            <label v-if="errors.phone" class="label">
              <span class="label-text-alt text-error">{{ errors.phone }}</span>
            </label>
          </div>

          <!-- Metadata -->
          <div class="divider"></div>
          <div class="text-sm text-base-content/70 space-y-1">
            <div class="flex justify-between">
              <span>Status:</span>
              <div class="badge badge-success">{{ contact.status }}</div>
            </div>
            <div class="flex justify-between">
              <span>Last Modified:</span>
              <span>{{ formatDate(contact.updatedAt) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Modified By:</span>
              <span>{{ contact.lastModifiedByName }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Notes Section -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <div class="flex justify-between items-center mb-4">
          <h2 class="card-title">Notes ({{ contact.notes?.length || 0 }})</h2>
          <button 
            class="btn btn-sm btn-primary gap-2"
            @click="showAddNoteModal = true"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Add Note
          </button>
        </div>

        <!-- Notes List -->
        <div v-if="contact.notes && contact.notes.length > 0" class="space-y-4 max-h-96 overflow-y-auto">
          <div 
            v-for="note in contact.notes" 
            :key="note._id"
            class="border border-base-300 rounded-lg p-4"
          >
            <div class="flex justify-between items-start mb-2">
              <div class="flex items-center gap-2">
                <div class="badge badge-outline">{{ note.type }}</div>
                <div v-if="note.isPrivate" class="badge badge-warning badge-sm">Private</div>
              </div>
              <div class="text-xs text-base-content/50">
                {{ formatDate(note.addedAt) }}
              </div>
            </div>
            <p class="text-sm mb-2">{{ note.content }}</p>
            <div class="text-xs text-base-content/50">
              by {{ note.addedByName }}
            </div>
          </div>
        </div>

        <!-- Empty Notes State -->
        <div v-else class="text-center py-8">
          <div class="text-4xl mb-2">📝</div>
          <p class="text-base-content/70">No notes yet</p>
          <p class="text-sm text-base-content/50">Add a note to keep track of interactions</p>
        </div>
      </div>
    </div>

    <!-- Add Note Modal -->
    <div v-if="showAddNoteModal" class="modal modal-open">
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-4">Add Note</h3>
        
        <form @submit.prevent="addNote">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Note Content</span>
            </label>
            <textarea
              v-model="noteForm.content"
              class="textarea textarea-bordered h-24"
              placeholder="Enter your note..."
              required
            ></textarea>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Type</span>
            </label>
            <select v-model="noteForm.type" class="select select-bordered">
              <option value="general">General</option>
              <option value="call">Call</option>
              <option value="meeting">Meeting</option>
              <option value="email">Email</option>
            </select>
          </div>

          <div class="form-control">
            <label class="cursor-pointer label">
              <span class="label-text">Private Note</span>
              <input 
                v-model="noteForm.isPrivate"
                type="checkbox" 
                class="checkbox checkbox-primary" 
              />
            </label>
          </div>

          <div class="modal-action">
            <button 
              type="submit" 
              class="btn btn-primary"
              :disabled="!noteForm.content.trim()"
            >
              Add Note
            </button>
            <button 
              type="button" 
              class="btn"
              @click="closeAddNoteModal"
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
import { ref, reactive, computed } from 'vue'
import { useContactStore } from '../stores/contact'

const props = defineProps({
  contact: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['contact-updated'])

const contactStore = useContactStore()

const isEditing = ref(false)
const showAddNoteModal = ref(false)
const errors = ref({})

const editForm = reactive({
  name: '',
  email: '',
  phone: ''
})

const noteForm = reactive({
  content: '',
  type: 'general',
  isPrivate: false
})

const startEditing = () => {
  editForm.name = props.contact.name
  editForm.email = props.contact.email || ''
  editForm.phone = props.contact.phone || ''
  errors.value = {}
  isEditing.value = true
}

const cancelEditing = () => {
  isEditing.value = false
  errors.value = {}
}

const validateForm = () => {
  errors.value = {}
  
  if (!editForm.name.trim()) {
    errors.value.name = 'Name is required'
  } else if (editForm.name.length < 2) {
    errors.value.name = 'Name must be at least 2 characters'
  }
  
  if (editForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) {
    errors.value.email = 'Please enter a valid email address'
  }
  
  if (editForm.phone && !/^[\+]?[\d\s\-\(\)]{10,}$/.test(editForm.phone)) {
    errors.value.phone = 'Please enter a valid phone number'
  }
  
  return Object.keys(errors.value).length === 0
}

const saveContact = async () => {
  if (!validateForm()) {
    return
  }

  try {
    const updatedContact = await contactStore.updateContact(props.contact._id, editForm)
    isEditing.value = false
    emit('contact-updated', updatedContact)
  } catch (error) {
    // Error handling is done in the store
  }
}

const addNote = async () => {
  try {
    await contactStore.addNote(props.contact._id, noteForm)
    closeAddNoteModal()
  } catch (error) {
    // Error handling is done in the store
  }
}

const closeAddNoteModal = () => {
  showAddNoteModal.value = false
  noteForm.content = ''
  noteForm.type = 'general'
  noteForm.isPrivate = false
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>