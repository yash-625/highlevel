<template>
  <nav class="flex" aria-label="Breadcrumb">
    <ol role="list" class="flex items-center space-x-4">
      <li v-for="(crumb, index) in breadcrumbs" :key="index">
        <div v-if="index === 0" class="flex">
          <RouterLink
            v-if="!crumb.current"
            :to="crumb.to!"
            class="text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            {{ crumb.label }}
          </RouterLink>
          <span v-else class="text-sm font-medium text-gray-900">
            {{ crumb.label }}
          </span>
        </div>
        <div v-else class="flex items-center">
          <ChevronRightIcon class="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
          <RouterLink
            v-if="!crumb.current"
            :to="crumb.to!"
            class="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            {{ crumb.label }}
          </RouterLink>
          <span v-else class="ml-4 text-sm font-medium text-gray-900">
            {{ crumb.label }}
          </span>
        </div>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { ChevronRightIcon } from '@heroicons/vue/20/solid';
import { useBreadcrumbs } from '@/composables/useBreadcrumbs';

const { breadcrumbs } = useBreadcrumbs();
</script> 