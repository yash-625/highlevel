<template>
  <div class="text-center py-12">
    <component
      v-if="icon"
      :is="icon"
      class="mx-auto h-12 w-12 text-gray-400"
      aria-hidden="true"
    />
    <h3 class="mt-4 text-sm font-semibold text-gray-900">{{ title }}</h3>
    <p class="mt-2 text-sm text-gray-500">{{ description }}</p>
    <div v-if="$slots.default" class="mt-6">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  description: string;
  icon?: any;
}

defineProps<Props>();
</script> 