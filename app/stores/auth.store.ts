import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: null as string | null,
    }),

    getters: {
        isAuthenticated: (state) => !!state.token
    },

    actions: {
        setToken(token: string) {
            this.token = token
            const cookie = useCookie('auth_token', {
                maxAge: 60 * 60 * 24 * 7, // 7 days
                sameSite: 'lax',
                secure: true,
            })
            cookie.value = token
        },

        loadFromStorage() {
            const cookie = useCookie('auth_token')
            if (cookie.value) this.token = cookie.value
        },

        logout() {
            this.token = null
            const cookie = useCookie('auth_token')
            cookie.value = null
        }
    }
})