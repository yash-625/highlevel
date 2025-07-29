<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Mobile sidebar -->
    <TransitionRoot as="template" :show="appStore.sidebarOpen">
      <Dialog as="div" class="relative z-50 lg:hidden" @close="appStore.closeSidebar">
        <TransitionChild
          as="template"
          enter="transition-opacity ease-linear duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-gray-900/80" />
        </TransitionChild>

        <div class="fixed inset-0 flex">
          <TransitionChild
            as="template"
            enter="transition ease-in-out duration-300 transform"
            enter-from="-translate-x-full"
            enter-to="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leave-from="translate-x-0"
            leave-to="-translate-x-full"
          >
            <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
              <TransitionChild
                as="template"
                enter="ease-in-out duration-300"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="ease-in-out duration-300"
                leave-from="opacity-100"
                leave-to="opacity-0"
              >
                <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
                  <button type="button" class="-m-2.5 p-2.5" @click="appStore.closeSidebar">
                    <span class="sr-only">Close sidebar</span>
                    <XMarkIcon class="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </TransitionChild>
              <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
                <div class="flex h-16 shrink-0 items-center">
                  <h1 class="text-xl font-bold text-gray-900">Contacts</h1>
                </div>
                <Sidebar />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Static sidebar for desktop -->
    <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div class="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
        <div class="flex h-16 shrink-0 items-center">
          <h1 class="text-xl font-bold text-gray-900">Contact Management</h1>
        </div>
        <Sidebar />
      </div>
    </div>

    <!-- Main content -->
    <div class="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden">
      <button type="button" class="-m-2.5 p-2.5 text-gray-700 lg:hidden" @click="appStore.toggleSidebar">
        <span class="sr-only">Open sidebar</span>
        <Bars3Icon class="h-6 w-6" aria-hidden="true" />
      </button>
      <div class="flex-1 text-sm font-semibold leading-6 text-gray-900">{{ pageTitle }}</div>
      <UserMenu />
    </div>

    <main class="py-6 lg:pl-72">
      <div class="px-4 sm:px-6 lg:px-8">
        <!-- Page header -->
        <div class="mb-6">
          <Breadcrumbs />
          <div class="mt-2 md:flex md:items-center md:justify-between">
            <div class="min-w-0 flex-1">
              <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                {{ pageTitle }}
              </h1>
            </div>
          </div>
        </div>

        <!-- Main content area -->
        <RouterView />
      </div>
    </main>

    <!-- Notifications -->
    <NotificationContainer />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue';
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline';
import { useAppStore } from '@/stores/app';
import { usePageMeta } from '@/composables/usePageMeta';

// Components
import Sidebar from '@/components/layout/Sidebar.vue';
import UserMenu from '@/components/layout/UserMenu.vue';
import Breadcrumbs from '@/components/layout/Breadcrumbs.vue';
import NotificationContainer from '@/components/ui/NotificationContainer.vue';

const appStore = useAppStore();
const { pageTitle } = usePageMeta();
</script> 