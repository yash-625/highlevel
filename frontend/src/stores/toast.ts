import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Toast } from '../types'

export const useToastStore = defineStore('toast', () => {
  const toast = ref<Toast | null>(null)

  const showToast = (message: string, type: Toast['type'] = 'info'): void => {
    toast.value = { message, type }
    
    // Auto-hide toast after 5 seconds
    setTimeout(() => {
      toast.value = null
    }, 5000)
  }

  const hideToast = (): void => {
    toast.value = null
  }

  return {
    toast,
    showToast,
    hideToast
  }
})