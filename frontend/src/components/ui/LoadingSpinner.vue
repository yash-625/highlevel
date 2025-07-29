<template>
  <div :class="containerClass">
    <div :class="spinnerClass">
      <div class="animate-spin rounded-full border-2 border-current border-t-transparent">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <p v-if="message" :class="messageClass">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  center?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  center: false
});

const containerClass = computed(() => [
  'flex flex-col items-center',
  props.center ? 'justify-center min-h-32' : ''
]);

const spinnerClass = computed(() => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };
  return [
    sizes[props.size],
    'text-primary-600'
  ];
});

const messageClass = computed(() => [
  'mt-2 text-sm text-gray-600',
  props.size === 'lg' ? 'text-base' : ''
]);
</script> 