<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';

// We'll initialize auth after the component is mounted and Pinia is ready
onMounted(async () => {
  // Wait for next tick to ensure Pinia is fully initialized
  await nextTick();
  
  // Dynamically import the auth store to avoid initialization issues
  const { useAuthStore } = await import('@/stores/auth');
  const authStore = useAuthStore();
  
  // Initialize authentication state from localStorage
  authStore.initializeFromStorage();
});
</script>

<style>
/* Global styles are handled by Tailwind CSS in style.css */
</style>