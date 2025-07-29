<template>
  <nav class="flex flex-1 flex-col">
    <ul role="list" class="flex flex-1 flex-col gap-y-7">
      <li>
        <ul role="list" class="-mx-2 space-y-1">
          <li v-for="item in navigationItems" :key="item.name">
            <RouterLink
              :to="item.to"
              :class="[
                item.current
                  ? 'bg-gray-50 text-primary-600'
                  : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50',
                'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
              ]"
            >
              <component
                :is="item.icon"
                :class="[
                  item.current ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-600',
                  'h-6 w-6 shrink-0'
                ]"
                aria-hidden="true"
              />
              {{ item.label }}
            </RouterLink>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { useNavigation } from '@/composables/useNavigation';

const { navigationItems, secondaryNavigationItems } = useNavigation();
</script> 