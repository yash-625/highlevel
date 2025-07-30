<template>
  <div class="min-h-screen bg-base-200 flex items-center justify-center">
    <div class="card w-96 bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title justify-center text-2xl mb-4">Login</h2>
        
        <form @submit.prevent="handleSubmit">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Username</span>
            </label>
            <input
              v-model="form.username"
              type="text"
              placeholder="Enter username"
              class="input input-bordered"
              :class="{ 'input-error': errors.username }"
              required
            />
            <label v-if="errors.username" class="label">
              <span class="label-text-alt text-error">{{ errors.username }}</span>
            </label>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Password</span>
            </label>
            <input
              v-model="form.password"
              type="password"
              placeholder="Enter password"
              class="input input-bordered"
              :class="{ 'input-error': errors.password }"
              required
            />
            <label v-if="errors.password" class="label">
              <span class="label-text-alt text-error">{{ errors.password }}</span>
            </label>
          </div>

          <div class="form-control mt-6">
            <button 
              type="submit" 
              class="btn btn-primary"
              :class="{ 'loading': authStore.loading }"
              :disabled="authStore.loading"
            >
              <span v-if="!authStore.loading">Login</span>
              <span v-else>Logging in...</span>
            </button>
          </div>
        </form>

        <div class="divider">OR</div>
        
        <router-link to="/signup" class="btn btn-outline">
          Create Account
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  username: '',
  password: ''
})

const errors = ref({})

const validateForm = () => {
  errors.value = {}
  
  if (!form.username.trim()) {
    errors.value.username = 'Username is required'
  } else if (form.username.length < 3) {
    errors.value.username = 'Username must be at least 3 characters'
  }
  
  if (!form.password) {
    errors.value.password = 'Password is required'
  } else if (form.password.length < 6) {
    errors.value.password = 'Password must be at least 6 characters'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  const result = await authStore.login(form)
  
  if (result.success) {
    router.push('/dashboard')
  }
}
</script>