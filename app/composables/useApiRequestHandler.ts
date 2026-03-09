export function useApiRequestHandler() {
    const loading = ref(false)
    const { handleError } = useApiErrorHandler()

    async function execute<T>(fn: () => Promise<T>): Promise<T | null> {
        loading.value = true
        try {
            return await fn()
        } catch (e: unknown) {
            handleError(e)
            return null
        } finally {
            loading.value = false
        }
    }

    return { loading, execute }
}