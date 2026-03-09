import { useI18n } from 'vue-i18n'

export type ValidationErrorParams = Record<string, unknown> | undefined

export interface ValidationError {
    code: string
    params?: ValidationErrorParams
}

export function useValidationErrorResolver() {
    const { t, te } = useI18n()

    function normalizeError(error?: string | ValidationError) {
        if (!error) return
        if (typeof error === 'string') return { code: error }
        return error
    }

    function resolveError(error?: string | ValidationError): string | undefined {
        const normalizedError = normalizeError(error)
        if (!normalizedError) return
        const key = `validation.${normalizedError.code}`
        return te(key) ? t(key, normalizedError.params ?? {}) : normalizedError.code
    }

    return { resolveError }
}