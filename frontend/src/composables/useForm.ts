import { ref, reactive, computed, readonly } from 'vue';
import { validateForm } from '@/utils/validation';

export function useForm<T extends Record<string, any>>(
  initialData: T,
  validationRules?: Record<string, Function[]>
) {
  const data = reactive<T>({ ...initialData });
  const errors = ref<Record<string, string>>({});
  const touched = ref<Record<string, boolean>>({});
  const submitting = ref(false);

  const isValid = computed(() => {
    return Object.keys(errors.value).length === 0;
  });

  const hasErrors = computed(() => {
    return Object.keys(errors.value).length > 0;
  });

  function validate(): boolean {
    if (!validationRules) return true;

    errors.value = validateForm(data, validationRules);
    return isValid.value;
  }

  function validateField(field: keyof T): void {
    if (!validationRules?.[field as string]) return;

    const fieldRules = validationRules[field as string];
    const value = data[field];

    for (const rule of fieldRules) {
      const result = rule(value);
      if (result !== true) {
        errors.value[field as string] = result;
        return;
      }
    }

    // Clear error if validation passes
    delete errors.value[field as string];
  }

  function touchField(field: keyof T): void {
    touched.value[field as string] = true;
    validateField(field);
  }

  function reset(newData?: Partial<T>): void {
    Object.assign(data, { ...initialData, ...newData });
    errors.value = {};
    touched.value = {};
    submitting.value = false;
  }

  function setFieldValue(field: keyof T, value: any): void {
    data[field] = value;
    if (touched.value[field as string]) {
      validateField(field);
    }
  }

  function setErrors(newErrors: Record<string, string>): void {
    errors.value = { ...newErrors };
  }

  return {
    data,
    errors: readonly(errors),
    touched: readonly(touched),
    submitting: readonly(submitting),
    isValid,
    hasErrors,
    validate,
    validateField,
    touchField,
    reset,
    setFieldValue,
    setErrors,
    setSubmitting: (value: boolean) => { submitting.value = value; }
  };
} 