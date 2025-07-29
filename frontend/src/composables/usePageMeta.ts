
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

export function usePageMeta() {
  const route = useRoute();
  const pageTitle = ref<string>('');
  const pageDescription = ref<string>('');

  // Update page title based on route
  watch(
    () => route.meta.title,
    (newTitle) => {
      if (newTitle) {
        pageTitle.value = newTitle as string;
        document.title = `${newTitle} - Contact Management`;
      }
    },
    { immediate: true }
  );

  function setTitle(title: string): void {
    pageTitle.value = title;
    document.title = `${title} - Contact Management`;
  }

  function setDescription(description: string): void {
    pageDescription.value = description;
  }

  return {
    pageTitle: readonly(pageTitle),
    pageDescription: readonly(pageDescription),
    setTitle,
    setDescription
  };
}