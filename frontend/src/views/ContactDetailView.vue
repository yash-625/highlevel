<template>
  <div v-if="contactStore.loading && !contact" class="flex justify-center items-center py-12">
    <span class="loading loading-spinner loading-lg"></span>
  </div>

  <div v-else-if="contact">
    <!-- Header -->
    <div class="flex items-center gap-4 mb-6">
      <button 
        class="btn btn-ghost btn-circle"
        @click="$router.push('/dashboard')"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>
      
      <div class="flex items-center gap-3">
        <div class="avatar placeholder">
          <div class="bg-primary text-primary-content rounded-full w-12">
            <span class="text-lg">{{ getContactInitials(contact.name) }}</span>
          </div>
        </div>
        <div>
          <h1 class="text-3xl font-bold">{{ contact.name }}</h1>
          <p class="text-base-content/70">
            Created {{ formatDate(contact.createdAt) }} by {{ contact.createdByName }}
          </p>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs tabs-lifted mb-6">
      <button 
        :class="['tab tab-lg', { 'tab-active': activeTab === 'details' }]"
        @click="activeTab = 'details'"
      >
        Contact Details
      </button>
      <button 
        :class="['tab tab-lg', { 'tab-active': activeTab === 'audit' }]"
        @click="activeTab = 'audit'"
      >
        Audit Logs
      </button>
    </div>

    <!-- Contact Details Tab -->
    <ContactInfoTab 
      v-if="activeTab === 'details'" 
      :contact="contact"
      @contact-updated="handleContactUpdated"
    />

    <!-- Audit Logs Tab -->
    <AuditLogsTab 
      v-if="activeTab === 'audit'" 
      :contact-id="contact._id"
    />
  </div>

  <div v-else class="text-center py-12">
    <div class="text-6xl mb-4">❌</div>
    <h3 class="text-xl font-semibold mb-2">Contact not found</h3>
    <p class="text-base-content/70 mb-4">The contact you're looking for doesn't exist or has been deleted.</p>
    <router-link to="/dashboard" class="btn btn-primary">
      Back to Dashboard
    </router-link>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useContactStore } from '../stores/contact'
import ContactInfoTab from '../components/ContactInfoTab.vue'
import AuditLogsTab from '../components/AuditLogsTab.vue'

const route = useRoute()
const contactStore = useContactStore()

const activeTab = ref('details')

const contact = computed(() => contactStore.currentContact)

onMounted(async () => {
  const contactId = route.params.id
  if (contactId) {
    try {
      await contactStore.getContact(contactId)
    } catch (error) {
      // Error handling is done in the store
    }
  }
})

// Watch for route changes (if navigating between different contacts)
watch(
  () => route.params.id,
  async (newId, oldId) => {
    if (newId && newId !== oldId) {
      try {
        await contactStore.getContact(newId)
      } catch (error) {
        // Error handling is done in the store
      }
    }
  }
)

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
    month: 'long',
    day: 'numeric'
  })
}

const handleContactUpdated = (updatedContact) => {
  // The contact is already updated in the store by ContactInfoTab
  // This is just for any additional handling if needed
}
</script>