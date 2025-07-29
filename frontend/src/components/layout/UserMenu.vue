<template>
  <Menu as="div" class="relative">
    <div>
      <MenuButton class="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 lg:p-2 lg:hover:bg-gray-50">
        <span class="sr-only">Open user menu</span>
        <div class="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
          <span class="text-sm font-medium text-white">
            {{ userInitials }}
          </span>
        </div>
        <span class="hidden lg:flex lg:items-center">
          <span class="ml-4 text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">
            {{ authStore.userName }}
          </span>
          <ChevronDownIcon class="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
        </span>
      </MenuButton>
    </div>
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <MenuItems class="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
        <MenuItem v-slot="{ active }">
          <button
            @click="handleLogout"
            :class="[active ? 'bg-gray-50' : '', 'block w-full px-3 py-1 text-left text-sm leading-6 text-gray-900']"
          >
            Sign out
          </button>
        </MenuItem>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import { ChevronDownIcon } from '@heroicons/vue/20/solid';
import { useAuthStore } from '@/stores/auth';
import { useAppStore } from '@/stores/app';
import { useRouterUtils } from '@/composables/useRouter';

const authStore = useAuthStore();
const appStore = useAppStore();
const { goToLogin } = useRouterUtils();

const userInitials = computed(() => {
  const name = authStore.userName;
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
});

function handleLogout() {
  authStore.logout();
  appStore.showSuccess('Logged out', 'You have been successfully logged out');
  goToLogin();
}
</script> 