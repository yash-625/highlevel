
import { useRouter, useRoute } from 'vue-router';
import { computed } from 'vue';

export function useRouterUtils() {
  const router = useRouter();
  const route = useRoute();

  const currentRouteName = computed(() => route.name as string);
  const currentPath = computed(() => route.path);
  const routeParams = computed(() => route.params);
  const routeQuery = computed(() => route.query);

  function goTo(name: string, params?: any, query?: any): void {
    router.push({ name, params, query });
  }

  function goBack(): void {
    router.back();
  }

  function goToContacts(): void {
    router.push({ name: 'ContactList' });
  }

  function goToContact(id: string): void {
    router.push({ name: 'ContactDetail', params: { id } });
  }

  function goToEditContact(id: string): void {
    router.push({ name: 'ContactEdit', params: { id } });
  }

  function goToCreateContact(): void {
    router.push({ name: 'ContactCreate' });
  }

  function goToDashboard(): void {
    router.push({ name: 'Dashboard' });
  }

  function goToLogin(redirectPath?: string): void {
    const query = redirectPath ? { redirect: redirectPath } : undefined;
    router.push({ name: 'Login', query });
  }

  return {
    currentRouteName,
    currentPath,
    routeParams,
    routeQuery,
    goTo,
    goBack,
    goToContacts,
    goToContact,
    goToEditContact,
    goToCreateContact,
    goToDashboard,
    goToLogin
  };
}