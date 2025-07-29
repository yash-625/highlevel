import { useAuthStore } from '@/stores/auth';
import { useContactsStore } from '@/stores/contacts';
import { useAppStore } from '@/stores/app';

export function useStores() {
  return {
    auth: useAuthStore(),
    contacts: useContactsStore(),
    app: useAppStore()
  };
} 