<template>
  <div class="min-h-screen bg-base-100">
    <!-- Navbar -->
    <div class="navbar bg-base-100 shadow-lg border-b">
      <div class="navbar-start">
        <router-link 
          to="/dashboard" 
          class="btn btn-ghost text-xl font-bold"
        >
          Contact Manager
        </router-link>
      </div>
      
      <div class="navbar-end">
        <!-- Profile Dropdown -->
        <div class="dropdown dropdown-end" ref="dropdownRef">
          <div 
            tabindex="0" 
            role="button" 
            class="btn btn-ghost btn-circle avatar placeholder"
            @click.stop="toggleProfileDropdown"
          >
            <div class="bg-primary text-primary-content rounded-full w-10">
              <span class="text-lg">{{ userInitials }}</span>
            </div>
          </div>
          
          <!-- Dropdown Menu -->
          <ul 
            v-show="showProfileDropdown"
            tabindex="0" 
            class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border"
          >
            <li class="menu-title">
              <span>{{ authStore.user?.name }}</span>
            </li>
            <li>
              <router-link 
                to="/profile" 
                @click="handleProfileClick"
                class="flex items-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                Profile
              </router-link>
            </li>
            <li>
              <button 
                @click="handleLogout"
                class="flex items-center gap-2 text-error"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-6">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const showProfileDropdown = ref<boolean>(false)
const dropdownRef = ref<HTMLElement | null>(null)

const userInitials = computed<string>(() => {
  if (!authStore.user?.name) return 'U'
  const names = authStore.user.name.split(' ')
  if (names.length >= 2) {
    return names[0][0] + names[1][0]
  }
  return names[0][0] || 'U'
})

const toggleProfileDropdown = (): void => {
  console.log('Toggle dropdown clicked, current state:', showProfileDropdown.value)
  showProfileDropdown.value = !showProfileDropdown.value
  console.log('New dropdown state:', showProfileDropdown.value)
}

const handleProfileClick = (): void => {
  console.log('Profile link clicked')
  showProfileDropdown.value = false
  console.log('Navigating to profile...')
  
  // Use programmatic navigation as backup
  router.push('/profile').then(() => {
    console.log('Successfully navigated to profile')
  }).catch((error) => {
    console.error('Navigation failed:', error)
  })
}

const handleLogout = (): void => {
  console.log('Logout clicked')
  showProfileDropdown.value = false
  authStore.logout()
  router.push('/login')
}

// Close dropdown when clicking outside
const handleClickOutside = (event: Event): void => {
  const target = event.target as HTMLElement
  
  // Check if the click is outside the dropdown
  if (dropdownRef.value && !dropdownRef.value.contains(target)) {
    console.log('Clicked outside dropdown, closing...')
    showProfileDropdown.value = false
  }
}

// Close dropdown on route change
const handleRouteChange = (): void => {
  console.log('Route changed, closing dropdown')
  showProfileDropdown.value = false
}

onMounted(() => {
  console.log('AuthenticatedLayout mounted')
  document.addEventListener('click', handleClickOutside)
  
  // Listen for route changes
  router.afterEach(handleRouteChange)
})

onUnmounted(() => {
  console.log('AuthenticatedLayout unmounted')
  document.removeEventListener('click', handleClickOutside)
})

// Debug: Watch dropdown state changes
import { watch } from 'vue'
watch(showProfileDropdown, (newValue, oldValue) => {
  console.log(`Dropdown state changed from ${oldValue} to ${newValue}`)
})
</script>

<style scoped>
/* Ensure dropdown is visible when open */
.dropdown-content {
  display: block !important;
}

/* Debug styles - remove these in production */
.dropdown.dropdown-open .dropdown-content {
  display: block;
}

/* Ensure proper z-index for dropdown */
.dropdown-content {
  z-index: 1000;
}
</style>