export interface ApiError {
    code?: string
    message?: string
    fields?: FieldError[]
}

export interface FieldError {
    field: string
    code: string
    message: string
    context?: Record<string, unknown>
}

export function useApiErrorHandler() {
    const { t, te } = useI18n()
    const toast = useToast()

    const isApiError = (e: unknown): e is ApiError =>
        typeof e === 'object' && e !== null

    const translate = (
        key: string,
        fallback?: string,
        params?: Record<string, unknown>
    ) => (te(key) ? t(key, params ?? {}) : fallback)

    const getErrorMessage = (e: unknown): string => {
        if (!isApiError(e)) return t('errors.INTERNAL_ERROR')

        const key = `errors.${e.code}`
        return translate(key, e.message) ?? t('errors.INTERNAL_ERROR')
    }

    const getFieldErrorsText = (fields: FieldError[]): string =>
        fields
            .map((f) => {
                const key = `validation.${f.code}`
                const message = translate(key, f.message, f.context)
                return `${f.field}: ${message}`
            })
            .join('\n')

    const showToast = (summary: string, detail: string) => {
        toast.add({
            severity: 'error',
            summary,
            detail,
            life: 4000,
        })
    }

    const handleError = (e: unknown) => {
        console.error('API Error:', e)

        if (!isApiError(e)) {
            showToast(t('general.error'), t('errors.INTERNAL_ERROR'))
            return
        }

        if (e.fields?.length) {
            showToast(getErrorMessage(e), getFieldErrorsText(e.fields))
            return
        }

        showToast(t('general.error'), getErrorMessage(e))
    }

    return { handleError }
}