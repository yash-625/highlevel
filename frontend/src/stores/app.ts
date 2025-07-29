import { defineStore } from 'pinia';
import { ref, readonly } from 'vue';

export const useAppStore = defineStore('app', () => {
  // State
  const sidebarOpen = ref(false);
  const notifications = ref<Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    timeout?: number;
  }>>([]);

  // Actions
  function toggleSidebar(): void {
    sidebarOpen.value = !sidebarOpen.value;
  }

  function closeSidebar(): void {
    sidebarOpen.value = false;
  }

  function addNotification(notification: {
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    timeout?: number;
  }): void {
    const id = Date.now().toString();
    const newNotification = {
      id,
      ...notification,
      timeout: notification.timeout || 5000
    };

    notifications.value.push(newNotification);

    // Auto remove after timeout
    if (newNotification.timeout > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.timeout);
    }
  }

  function removeNotification(id: string): void {
    const index = notifications.value.findIndex(n => n.id === id);
    if (index !== -1) {
      notifications.value.splice(index, 1);
    }
  }

  function clearNotifications(): void {
    notifications.value = [];
  }

  // Convenience methods for different notification types
  function showSuccess(title: string, message: string): void {
    addNotification({ type: 'success', title, message });
  }

  function showError(title: string, message: string): void {
    addNotification({ type: 'error', title, message, timeout: 8000 });
  }

  function showWarning(title: string, message: string): void {
    addNotification({ type: 'warning', title, message });
  }

  function showInfo(title: string, message: string): void {
    addNotification({ type: 'info', title, message });
  }

  return {
    // State
    sidebarOpen: readonly(sidebarOpen),
    notifications: readonly(notifications),
    
    // Actions
    toggleSidebar,
    closeSidebar,
    addNotification,
    removeNotification,
    clearNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
}); 