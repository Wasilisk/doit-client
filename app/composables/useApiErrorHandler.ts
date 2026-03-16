export interface ApiError {
  code?: string;
  message?: string;
  fields?: FieldError[];
}

export interface FieldError {
  field: string;
  code: string;
  message: string;
  context?: Record<string, unknown>;
}

export function useApiErrorHandler() {
  const { t } = useI18n();
  const toast = useToast();

  const isApiError = (e: unknown): e is ApiError =>
    typeof e === "object" && e !== null;

  const getErrorMessage = (e: unknown): string => {
    if (!isApiError(e)) return t("errors.INTERNAL_ERROR");

    return e.message ?? t("errors.INTERNAL_ERROR");
  };

  const showToast = (summary: string, detail: string) => {
    toast.add({
      severity: "error",
      summary,
      detail,
      life: 4000,
    });
  };

  const handleError = (e: unknown) => {
    console.error("API Error:", e);

    if (!isApiError(e)) {
      showToast(t("general.error"), t("errors.INTERNAL_ERROR"));
      return;
    }

    showToast(t("general.error"), getErrorMessage(e));
  };

  return { handleError };
}
