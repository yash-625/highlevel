
import { computed } from 'vue';
import { useRoute } from 'vue-router';

export interface BreadcrumbItem {
  label: string;
  to?: { name: string; params?: any };
  current?: boolean;
}

export function useBreadcrumbs() {
  const route = useRoute();

  const breadcrumbs = computed((): BreadcrumbItem[] => {
    const crumbs: BreadcrumbItem[] = [
      { label: 'Dashboard', to: { name: 'Dashboard' } }
    ];

    switch (route.name) {
      case 'Dashboard':
        crumbs[0].current = true;
        break;

      case 'ContactList':
        crumbs.push({ label: 'Contacts', current: true });
        break;

      case 'ContactCreate':
        crumbs.push(
          { label: 'Contacts', to: { name: 'ContactList' } },
          { label: 'New Contact', current: true }
        );
        break;

      case 'ContactDetail':
        crumbs.push(
          { label: 'Contacts', to: { name: 'ContactList' } },
          { label: 'Contact Details', current: true }
        );
        break;

      case 'ContactEdit':
        crumbs.push(
          { label: 'Contacts', to: { name: 'ContactList' } },
          { 
            label: 'Contact Details', 
            to: { name: 'ContactDetail', params: { id: route.params.id } } 
          },
          { label: 'Edit', current: true }
        );
        break;

      default:
        crumbs[0].current = true;
    }

    return crumbs;
  });

  return {
    breadcrumbs
  };
}