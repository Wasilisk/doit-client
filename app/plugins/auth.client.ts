import { defineNuxtPlugin } from "nuxt/app"

export default defineNuxtPlugin(() => {
    if (import.meta.client) {
        const authStore = useAuthStore()
        authStore.loadFromStorage()
    }
})