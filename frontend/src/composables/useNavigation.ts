
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { 
  HomeIcon, 
  UsersIcon, 
  PlusIcon,
  Cog6ToothIcon 
} from '@heroicons/vue/24/outline';

export interface NavigationItem {
  name: string;
  label: string;
  icon: any;
  to: { name: string };
  current?: boolean;
  badge?: string | number;
}

export function useNavigation() {
  const route = useRoute();

  const navigationItems = computed((): NavigationItem[] => [
    {
      name: 'dashboard',
      label: 'Dashboard',
      icon: HomeIcon,
      to: { name: 'Dashboard' },
      current: route.name === 'Dashboard'
    },
    {
      name: 'contacts',
      label: 'Contacts',
      icon: UsersIcon,
      to: { name: 'ContactList' },
      current: ['ContactList', 'ContactDetail', 'ContactEdit'].includes(route.name as string)
    },
    {
      name: 'new-contact',
      label: 'New Contact',
      icon: PlusIcon,
      to: { name: 'ContactCreate' },
      current: route.name === 'ContactCreate'
    }
  ]);

  const secondaryNavigationItems = computed((): NavigationItem[] => [
    {
      name: 'settings',
      label: 'Settings',
      icon: Cog6ToothIcon,
      to: { name: 'Dashboard' }, // Placeholder
      current: false
    }
  ]);

  return {
    navigationItems,
    secondaryNavigationItems
  };
}