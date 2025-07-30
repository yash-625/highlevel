<template>
  <div class="min-h-screen bg-base-200 flex items-center justify-center">
    <div class="card w-96 bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title justify-center text-2xl mb-4">Sign Up</h2>
        
        <form @submit.prevent="handleSubmit">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Full Name</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              placeholder="Enter your name"
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
              <span class="label-text">Username</span>
            </label>
            <input
              v-model="form.username"
              type="text"
              placeholder="Choose username"
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
              <span class="label-text">Email</span>
            </label>
            <input
              v-model="form.email"
              type="email"
              placeholder="Enter email"
              class="input input-bordered"
              :class="{ 'input-error': errors.email }"
              required
            />
            <label v-if="errors.email" class="label">
              <span class="label-text-alt text-error">{{ errors.email }}</span>
            </label>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Organization</span>
            </label>
            <input
              v-model="form.organizationName"
              type="text"
              placeholder="Organization name"
              class="input input-bordered"
              :class="{ 'input-error': errors.organizationName }"
              required
            />
            <label v-if="errors.organizationName" class="label">
              <span class="label-text-alt text-error">{{ errors.organizationName }}</span>
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
              <span v-if="!authStore.loading">Sign Up</span>
              <span v-else>Creating Account...</span>
            </button>
          </div>
        </form>

        <div class="divider">OR</div>
        
        <router-link to="/login" class="btn btn-outline">
          Back to Login
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
  name: '',
  username: '',
  email: '',
  organizationName: '',
  password: ''
})

const errors = ref({})

const validateForm = () => {
  errors.value = {}
  
  if (!form.name.trim()) {
    errors.value.name = 'Name is required'
  } else if (form.name.length < 2) {
    errors.value.name = 'Name must be at least 2 characters'
  }
  
  if (!form.username.trim()) {
    errors.value.username = 'Username is required'
  } else if (form.username.length < 3) {
    errors.value.username = 'Username must be at least 3 characters'
  } else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {
    errors.value.username = 'Username can only contain letters, numbers, and underscores'
  }
  
  if (!form.email.trim()) {
    errors.value.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.value.email = 'Please enter a valid email address'
  }
  
  if (!form.organizationName.trim()) {
    errors.value.organizationName = 'Organization name is required'
  } else if (form.organizationName.length < 2) {
    errors.value.organizationName = 'Organization name must be at least 2 characters'
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

  const result = await authStore.register(form)
  
  if (result.success) {
    router.push('/dashboard')
  }
}
</script>