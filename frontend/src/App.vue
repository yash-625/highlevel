<template>
  <div id="app">
    <!-- Toast Notifications -->
    <div v-if="toast" class="toast toast-top toast-end z-50">
      <div :class="toastClass">
        <span>{{ toast.message }}</span>
      </div>
    </div>

    <!-- Main Content -->
    <router-view />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useToastStore } from './stores/toast'

const toastStore = useToastStore()

const toast = computed(() => toastStore.toast)

const toastClass = computed(() => {
  if (!toast.value) return ''
  const baseClass = 'alert'
  switch (toast.value.type) {
    case 'success':
      return `${baseClass} alert-success`
    case 'error':
      return `${baseClass} alert-error`
    case 'warning':
      return `${baseClass} alert-warning`
    default:
      return `${baseClass} alert-info`
  }
})
</script>

<style>
/* DaisyUI will handle most styling */
#app {
  min-height: 100vh;
}
</style>