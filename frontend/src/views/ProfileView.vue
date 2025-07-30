<template>
  <div class="max-w-2xl mx-auto">
    <div class="mb-6">
      <h1 class="text-3xl font-bold">Profile</h1>
      <p class="text-base-content/70 mt-1">Manage your account information</p>
    </div>

    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <!-- Profile Header -->
        <div class="flex items-center gap-4 mb-6 pb-6 border-b border-base-300">
          <div class="avatar placeholder">
            <div class="bg-primary text-primary-content rounded-full w-20">
              <span class="text-2xl">{{ userInitials }}</span>
            </div>
          </div>
          <div>
            <h2 class="text-2xl font-bold">{{ user?.name }}</h2>
            <p class="text-base-content/70">@{{ user?.username }}</p>
            <div class="badge badge-success badge-sm mt-1">Active</div>
          </div>
        </div>

        <!-- Profile Information -->
        <div class="space-y-6">
          <!-- Personal Information -->
          <div>
            <h3 class="text-lg font-semibold mb-4">Personal Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-semibold">Full Name</span>
                </label>
                <div class="flex items-center gap-2 p-3 bg-base-200 rounded-lg">
                  <svg class="w-5 h-5 text-base-content/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  <span>{{ user?.name }}</span>
                </div>
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text font-semibold">Username</span>
                </label>
                <div class="flex items-center gap-2 p-3 bg-base-200 rounded-lg">
                  <svg class="w-5 h-5 text-base-content/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  <span>{{ user?.username }}</span>
                </div>
              </div>

              <div class="form-control md:col-span-2">
                <label class="label">
                  <span class="label-text font-semibold">Email Address</span>
                </label>
                <div class="flex items-center gap-2 p-3 bg-base-200 rounded-lg">
                  <svg class="w-5 h-5 text-base-content/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <span>{{ user?.email }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Organization Information -->
          <div>
            <h3 class="text-lg font-semibold mb-4">Organization</h3>
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold">Organization ID</span>
              </label>
              <div class="flex items-center gap-2 p-3 bg-base-200 rounded-lg">
                <svg class="w-5 h-5 text-base-content/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h6m2 4h2M9 15h4"></path>
                </svg>
                <span class="font-mono text-sm">{{ user?.organizationId }}</span>
              </div>
            </div>
          </div>

          <!-- Account Statistics -->
          <div>
            <h3 class="text-lg font-semibold mb-4">Account Statistics</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="stat bg-base-200 rounded-lg">
                <div class="stat-figure text-primary">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
                <div class="stat-title">Total Contacts</div>
                <div class="stat-value text-primary">{{ contactStats.total }}</div>
                <div class="stat-desc">in your organization</div>
              </div>

              <div class="stat bg-base-200 rounded-lg">
                <div class="stat-figure text-secondary">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <div class="stat-title">Total Notes</div>
                <div class="stat-value text-secondary">{{ contactStats.notes }}</div>
                <div class="stat-desc">across all contacts</div>
              </div>

              <div class="stat bg-base-200 rounded-lg">
                <div class="stat-figure text-accent">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div class="stat-title">Member Since</div>
                <div class="stat-value text-accent text-lg">{{ formatMemberSince }}</div>
                <div class="stat-desc">{{ daysSinceMember }} days ago</div>
              </div>
            </div>
          </div>

          <!-- Account Details -->
          <div>
            <h3 class="text-lg font-semibold mb-4">Account Details</h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center p-3 bg-base-200 rounded-lg">
                <div class="flex items-center gap-2">
                  <svg class="w-5 h-5 text-base-content/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>Account Status</span>
                </div>
                <div class="badge badge-success">{{ user?.isActive ? 'Active' : 'Inactive' }}</div>
              </div>

              <div class="flex justify-between items-center p-3 bg-base-200 rounded-lg">
                <div class="flex items-center gap-2">
                  <svg class="w-5 h-5 text-base-content/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6a2 2 0 012 2v8a2 2 0 01-2 2H10a2 2 0 01-2-2v-8a2 2 0 012-2z"></path>
                  </svg>
                  <span>Account Created</span>
                </div>
                <span class="text-sm">{{ formatDate(user?.createdAt) }}</span>
              </div>

              <div class="flex justify-between items-center p-3 bg-base-200 rounded-lg">
                <div class="flex items-center gap-2">
                  <svg class="w-5 h-5 text-base-content/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                  <span>Security</span>
                </div>
                <div class="badge badge-info">JWT Protected</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="divider"></div>
        <div class="flex justify-between items-center">
          <button 
            class="btn btn-outline btn-error gap-2"
            @click="showLogoutConfirm = true"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            Logout
          </button>
          
          <router-link to="/dashboard" class="btn btn-primary">
            Back to Dashboard
          </router-link>
        </div>
      </div>
    </div>

    <!-- Logout Confirmation Modal -->
    <div v-if="showLogoutConfirm" class="modal modal-open">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Confirm Logout</h3>
        <p class="py-4">Are you sure you want to logout? You'll need to login again to access your account.</p>
        <div class="modal-action">
          <button 
            class="btn btn-error"
            @click="handleLogout"
          >
            Yes, Logout
          </button>
          <button 
            class="btn"
            @click="showLogoutConfirm = false"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useContactStore } from '../stores/contact'
import type { User } from '../types'

interface ContactStats {
  total: number
  notes: number
}

const router = useRouter()
const authStore = useAuthStore()
const contactStore = useContactStore()

const showLogoutConfirm = ref<boolean>(false)
const contactStats = ref<ContactStats>({
  total: 0,
  notes: 0
})

const user = computed<User | null>(() => authStore.user)

const userInitials = computed<string>(() => {
  if (!user.value?.name) return 'U'
  const names = user.value.name.split(' ')
  if (names.length >= 2) {
    return names[0][0] + names[1][0]
  }
  return names[0][0] || 'U'
})

const formatMemberSince = computed<string>(() => {
  if (!user.value?.createdAt) return 'N/A'
  return new Date(user.value.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short'
  })
})

const daysSinceMember = computed<number>(() => {
  if (!user.value?.createdAt) return 0
  const createdDate = new Date(user.value.createdAt)
  const today = new Date()
  const diffTime = Math.abs(today.getTime() - createdDate.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

onMounted(async (): Promise<void> => {
  // Load contact statistics
  try {
    await contactStore.loadContacts(1)
    contactStats.value.total = contactStore.pagination.total
    
    // Calculate total notes across all contacts
    let totalNotes = 0
    contactStore.contacts.forEach(contact => {
      totalNotes += contact.notes?.length || 0
    })
    contactStats.value.notes = totalNotes
  } catch (error) {
    // Error handling is done in the store
    console.error('Failed to load contact statistics:', error)
  }
})

const formatDate = (dateString?: string): string => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const handleLogout = (): void => {
  showLogoutConfirm.value = false
  authStore.logout()
  router.push('/login')
}
</script>