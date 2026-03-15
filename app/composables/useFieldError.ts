import { computed } from "vue";

export function useFieldError(
  error: () => string | ValidationError | undefined,
) {
  const { resolveError } = useValidationErrorResolver();
  const translatedError = computed(() => resolveError(error()));
  return { translatedError };
}
